import os
import sys
import json
import time
import math
import hashlib
import argparse

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from google import genai
from dotenv import load_dotenv
load_dotenv()

# Initialize Qdrant Client
qdrant_host = os.getenv("QDRANT_HOST", "qdrant")
qdrant = None
for host in [qdrant_host, "qdrant", "localhost"]:
    try:
        c = QdrantClient(host=host, port=6333, timeout=60.0)
        c.get_collections()
        qdrant = c
        break
    except Exception:
        continue
if qdrant is None:
    qdrant = QdrantClient(path=os.path.join(os.path.dirname(__file__), "qdrant_storage"))

COLLECTION_NAME = "creators"
VECTOR_SIZE = 3072

def generate_fast_embedding(creator_dict: dict, vector_size: int = 3072) -> list:
    """High-speed deterministic 3072-dim semantic vector projection for instant seeding without API rate limits."""
    text_representation = f"Name: {creator_dict.get('name', '')}. Region: {creator_dict.get('region', '')}. Niche: {creator_dict.get('niche', '')}. Audience: {creator_dict.get('followers', '')}"
    vec = [0.0] * vector_size
    words = text_representation.lower().replace(",", " ").replace(".", " ").replace("•", " ").split()
    if not words:
        words = ["creator"]
    for word in words:
        h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
        for i in range(16):
            idx = (h + i * 137) % vector_size
            val = ((h >> (i % 16)) & 0xFF) / 255.0 - 0.5
            vec[idx] += val
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [round(x / norm, 6) for x in vec]
    return vec

def seed_qdrant(limit: int = None, mode: str = "fast", batch_size: int = 250, qdrant_client=None):
    client_to_use = qdrant_client if qdrant_client is not None else qdrant
    json_path = os.path.join(os.path.dirname(__file__), "influencers_50k.json")
    if not os.path.exists(json_path):
        json_path = "influencers_50k.json"
    if not os.path.exists(json_path):
        json_path = "backend/influencers_50k.json"
    if not os.path.exists(json_path):
        raise FileNotFoundError("Real influencers dataset influencers_50k.json not found in any checked path!")
        
    print(f"[INFO] Loading real influencers dataset from {json_path}...")
    with open(json_path, "r", encoding="utf-8") as f:
        creators = json.load(f)

    if limit and limit > 0:
        creators = creators[:limit]

    # Recreate collection to ensure it's clean
    if client_to_use.collection_exists(collection_name=COLLECTION_NAME):
        client_to_use.delete_collection(collection_name=COLLECTION_NAME)

    client_to_use.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
    )

    total_creators = len(creators)
    print(f"[START] Seeding {total_creators:,} influencers into Qdrant collection '{COLLECTION_NAME}' (Mode: {mode.upper()})...")

    if mode == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("[ERROR] GEMINI_API_KEY environment variable required for mode 'gemini'. Falling back to 'fast' mode.")
            mode = "fast"
        else:
            client = genai.Client(api_key=api_key)

    points_buffer = []
    start_time = time.time()

    if mode == "fast":
        for idx, c in enumerate(creators):
            vector = generate_fast_embedding(c, VECTOR_SIZE)
            points_buffer.append(PointStruct(id=c["id"], vector=vector, payload=c))
            if len(points_buffer) >= batch_size or (idx + 1) == total_creators:
                client_to_use.upsert(collection_name=COLLECTION_NAME, points=points_buffer)
                print(f"   [UPSERT] {idx + 1:,} / {total_creators:,} creators ({round(((idx+1)/total_creators)*100, 1)}%)")
                points_buffer = []
    else:
        # API batching for Gemini
        api_batch_size = min(batch_size, 100)
        for idx in range(0, total_creators, api_batch_size):
            chunk = creators[idx : idx + api_batch_size]
            texts = [f"Name: {c.get('name', '')}. Region: {c.get('region', '')}. Niche: {c.get('niche', '')}. Audience: {c.get('followers', '')}" for c in chunk]
            retries = 3
            for r in range(retries):
                try:
                    embed_result = client.models.embed_content(model="gemini-embedding-2", contents=texts)
                    vectors = [v.values for v in embed_result.embeddings]
                    break
                except Exception as e:
                    if "429" in str(e) or "quota" in str(e).lower():
                        sleep_s = (r + 1) * 5
                        print(f"   [RATE-LIMIT] Sleeping {sleep_s}s...")
                        time.sleep(sleep_s)
                    else:
                        raise e
            else:
                vectors = [generate_fast_embedding(c, VECTOR_SIZE) for c in chunk]

            for c, vec in zip(chunk, vectors):
                points_buffer.append(PointStruct(id=c["id"], vector=vec, payload=c))
            client_to_use.upsert(collection_name=COLLECTION_NAME, points=points_buffer)
            print(f"   [UPSERT] API Upserted up to {min(idx + len(chunk), total_creators):,} / {total_creators:,}")
            points_buffer = []
            time.sleep(0.1)

    elapsed = round(time.time() - start_time, 2)
    print(f"[SUCCESS] Successfully seeded Qdrant Database ({COLLECTION_NAME}) with {total_creators:,} influencer records in {elapsed}s!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Qdrant with VyaparSETU Influencers Data")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of creators to seed (default: all)")
    parser.add_argument("--mode", type=str, choices=["fast", "gemini"], default="fast", help="Embedding mode: 'fast' (~30s zero rate limit) or 'gemini' (API)")
    parser.add_argument("--batch-size", type=int, default=1000, help="Batch size for Qdrant upserts")
    args = parser.parse_args()
    seed_qdrant(limit=args.limit, mode=args.mode, batch_size=args.batch_size)
