from app.database.session import get_db
from app.models.password import Password
from app.schemas.password import PasswordCreate, PasswordHistory, PasswordResponse
from app.services.generator import generate_password
from app.services.strength import calculate_entropy, get_strength
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/generate", response_model=PasswordResponse)
def generate(data: PasswordCreate, db: Session = Depends(get_db)):
    password = generate_password(
        data.length, data.include_symbols, data.include_numbers
    )

    entropy = calculate_entropy(password)
    strength = get_strength(entropy)

    # save to db
    db_password = Password(
        password=password,
        length=data.length,
        has_symbols=data.include_symbols,
        has_numbers=data.include_numbers,
        strength_score=entropy,
    )

    db.add(db_password)
    db.commit()
    db.refresh(db_password)

    return {
        "password": password,
        "strength_score": entropy,
    }


@router.get("/history", response_model=list[PasswordHistory])
def get_history(db: Session = Depends(get_db)):
    return db.query(Password).all()
