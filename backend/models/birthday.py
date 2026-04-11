from sqlmodel import SQLModel, Field
from typing import Optional
import datetime


class Birthday(SQLModel, table=True):
    bday_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    date: datetime.date
    notes: Optional[str] = Field(default=None)  # optional extra notes
    last_reminded: Optional[datetime.date] = Field(default=None)


class BirthdayCreate(SQLModel):
    name: str
    date: datetime.date
    notes: Optional[str] = None


class BirthdayRead(SQLModel):
    bday_id: int
    name: str
    date: datetime.date
    notes: Optional[str] = None
    last_reminded: Optional[datetime.date] = None