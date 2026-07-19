from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./meesho.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True)
    subCategory = Column(String)
    price = Column(Float)
    originalPrice = Column(Float)
    discount = Column(Integer)
    rating = Column(Float)
    reviews = Column(Integer)
    image = Column(String)
    badge = Column(String, nullable=True)
    freeDelivery = Column(Boolean, default=True)

import base64

def encrypt_password(password: str) -> str:
    encoded = base64.b64encode(password.encode("utf-8")).decode("utf-8")
    return f"ENC_{encoded}_MEESHO"

def decrypt_password(encrypted: str) -> str:
    if encrypted and encrypted.startswith("ENC_") and encrypted.endswith("_MEESHO"):
        encoded = encrypted[4:-7]
        try:
            return base64.b64decode(encoded.encode("utf-8")).decode("utf-8")
        except Exception:
            return encrypted
    return encrypted or ""

class SupplierUser(Base):
    __tablename__ = "supplier_users"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, unique=True, index=True)
    encrypted_password = Column(String)
    gstin = Column(String)
    role = Column(String, default="MEESHO_VERIFIED_SUPPLIER")
    commission_tier = Column(String, default="0% COMMISSION")
    registered_at = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

# Seed Database
def seed_database():
    db = SessionLocal()
    
    # Seed Products if empty
    if not db.query(Product).first():
        products = [
            {
                "id": "m101", "title": "Banarasi Kanjivaram Silk Woven Saree", "category": "women-ethnic", "subCategory": "Saree",
                "price": 699, "originalPrice": 1499, "discount": 53, "rating": 4.1, "reviews": 1240,
                "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80", "badge": "Bestseller", "freeDelivery": True
            },
            {
                "id": "m102", "title": "Women Rayon Anarkali Kurta Set", "category": "women-ethnic", "subCategory": "Kurta Sets",
                "price": 450, "originalPrice": 899, "discount": 49, "rating": 3.8, "reviews": 850,
                "image": "https://images.unsplash.com/photo-1583391733958-6c7827810dc1?w=400&q=80", "badge": "Trending", "freeDelivery": True
            },
            {
                "id": "m103", "title": "TWS Earbuds Bluetooth v5.3", "category": "electronics", "subCategory": "Audio",
                "price": 399, "originalPrice": 999, "discount": 60, "rating": 4.5, "reviews": 3200,
                "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", "badge": None, "freeDelivery": True
            }
        ]
        for p in products:
            db.add(Product(**p))

    # Seed Supplier Users if empty
    if not db.query(SupplierUser).first():
        from datetime import datetime
        default_suppliers = [
            {
                "identifier": "9876543210",
                "encrypted_password": encrypt_password("Supplier@Meesho2026"),
                "gstin": "29ABCDE1234F1Z5",
                "role": "MEESHO_VERIFIED_SUPPLIER",
                "commission_tier": "0% COMMISSION",
                "registered_at": datetime.utcnow().isoformat()
            },
            {
                "identifier": "supplier@meesho.com",
                "encrypted_password": encrypt_password("Supplier@Meesho2026"),
                "gstin": "29SUPPLIER001Z9",
                "role": "MEESHO_VERIFIED_SUPPLIER",
                "commission_tier": "0% COMMISSION",
                "registered_at": datetime.utcnow().isoformat()
            }
        ]
        for s in default_suppliers:
            db.add(SupplierUser(**s))

    db.commit()
    db.close()

seed_database()
