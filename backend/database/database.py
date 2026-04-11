
from sqlmodel import SQLModel, create_engine, Session
from typing import Annotated
from fastapi import Depends
from pathlib import Path

# Always store the DB next to this file (backend/database/database.db)
# so the path is consistent regardless of where you launch from.
DB_PATH = Path(__file__).parent / "database.db"
sqlite_url = f"sqlite:///{DB_PATH}"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
