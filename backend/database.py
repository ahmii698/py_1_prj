import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

# har request ke liye DB session (Laravel ke DB connection jaisa)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()