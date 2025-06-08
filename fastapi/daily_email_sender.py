# daily_email_sender.py

from datetime import date
from sqlmodel import Session, select
from services.birthday import send_email
from database.database import engine
from models.birthday import Birthday

def send_birthday_emails():
    today = date.today()
    with Session(engine) as session:
        birthdays = session.exec(select(Birthday)).all()
        for bday in birthdays:
            if (
                bday.date.month == today.month and
                bday.date.day == today.day and
                (bday.last_sent is None or bday.last_sent != today)
            ):
                send_email(bday.email, bday.name)
                bday.last_sent = today
                session.add(bday)
        session.commit()

if __name__ == "__main__":
    send_birthday_emails()
