from app.database.session import Base, engine
from app.models import password
from fastapi import FastAPI

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "API running"}
