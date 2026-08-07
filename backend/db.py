# backend/db.py
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_db():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client["india_tourism"]
    return db