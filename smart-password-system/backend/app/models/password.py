from datetime import datetime

from app.database.session import Base
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String


class Password(Base):
    __tablename__ = "passwords"

    id = Column(Integer, primary_key=True, index=True)
    password = Column(String, nullable=False)
    length = Column(Integer)
    has_symbols = Column(Boolean)
    has_numbers = Column(Boolean)
    strength_score = Column(Float)
    create_at = Column(DateTime, default=datetime.utcnow)
