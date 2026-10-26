from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models  # ye line zaroori hai, warna tables nahi banenge

# MySQL me saare 14 tables bana do (jo pehle se hain unhe chhedta nahi)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Adaptive Learning API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Test Analyzer API chal raha hai"}


# Database connect hai ya nahi, ye check karne ke liye
@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}