from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///.passwords.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)  # connects to database

SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)  # creates DB sessions (Used in APIs)

Base = declarative_base()  # base class for all models


def get_db():
    db = SessionLocal()  # this ensures DB opens per request
    try:
        yield db
    finally:
        db.close()  # closes autometically
