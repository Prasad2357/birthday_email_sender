from sqlmodel import SQLModel, Field
from typing import Optional
import datetime


class Birthday(SQLModel, table=True):
    bday_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    date: datetime.date
    description: str = "birthday"
    email: str
    last_sent: Optional[datetime.date] = Field(default=None)

class BirthdayCreate(SQLModel):
    name: str
    date: datetime.date
    description: str = "birthday"
    email: str

"""
FastAPI, I'm getting a model without bday_id from the user, 
but I need to convert it into a model that knows about the 
database table so I can save it. So there are two different models
"""