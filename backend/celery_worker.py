import time
import os
from celery import Celery
from twilio.rest import Client

# Configure Celery to use Redis as the broker
app = Celery(
    'outreach_tasks',
    broker=os.getenv('REDIS_URL', 'redis://redis:6379/0'),
    backend=os.getenv('REDIS_URL', 'redis://redis:6379/0')
)

# Initialize Twilio
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886") # Twilio Sandbox Number

@app.task(name='celery_worker.dispatch_outreach_campaign')
def dispatch_outreach_campaign(creators: list, product: str, price: str):
    """
    Simulates sending messages across multiple channels (WhatsApp and Email).
    In a real-world scenario, this would integrate with WhatsApp Cloud API, Gmail SMTP, etc.
    """
    print(f"[x] Starting Outreach Campaign for {product} at {price}")
    print(f"[x] Target Creators: {creators}")
    
    # Setup Twilio Client
    client = None
    if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    else:
        print("WARNING: Twilio credentials not found. Falling back to mock dispatch.")

    # In a real database, we would fetch the creator's actual phone number.
    # For the hackathon, we will send ALL messages to the verified Twilio Sandbox number 
    # (which the user must provide in .env as HACKATHON_TEST_PHONE)
    test_phone = os.getenv("HACKATHON_TEST_PHONE")

    # Simulate processing time per creator
    for creator_id in creators:
        print(f"    -> Dispatching WhatsApp to {creator_id}...")
        
        if client and test_phone:
            try:
                message = client.messages.create(
                    from_=TWILIO_WHATSAPP_NUMBER,
                    body=f"🚀 *New VyaparSETU Liquidation Deal!*\n\nProduct: {product}\nTarget Price: {price}\n\nAre you available to run this campaign in your region?",
                    to=f"whatsapp:{test_phone}"
                )
                print(f"       ✅ WhatsApp Sent! SID: {message.sid}")
            except Exception as e:
                print(f"       ❌ Twilio Error: {e}")
        else:
            time.sleep(0.5)
            print("       (Mock) WhatsApp sent.")
        
        print(f"    -> Dispatching Email to {creator_id}...")
        time.sleep(0.5)
        
    print(f"[✓] Campaign Dispatch Complete for {len(creators)} creators.")
    return {"status": "success", "dispatched_count": len(creators)}
