from sqlmodel import Session, select
from models.birthday import Birthday, BirthdayCreate
from sqlalchemy import extract
from datetime import date, timedelta
import requests
from utils.config import EMAIL, APP_PASSWORD
from database.database import engine
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from datetime import datetime



logging.basicConfig(
    filename='birthday_email.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def create_birthday(session: Session, data: BirthdayCreate):
    birthday = Birthday.model_validate(data)
    session.add(birthday)
    session.commit()
    session.refresh(birthday)
    return birthday

def get_all_birthdays(session: Session):
    return session.exec(select(Birthday)).all()

def get_birthday(session: Session, bday_id: int):
    return session.get(Birthday, bday_id)

def get_birthday_by_month(session: Session, month:int ):
    statement = select(Birthday).where(extract("month", Birthday.date)==month)
    results = session.exec(statement).all()
    return results

def get_birthday_in_next_days(session: Session, days:int =7):
    today = date.today()
    upcoming = today + timedelta(days=days)

    birthdays = session.exec(select(Birthday)).all()
    upcoming_birhdays = []

    for bday in birthdays:
        this_year_bday = bday.date.replace(year=today.year)

        if this_year_bday < today:
            this_year_bday = this_year_bday.replace(year= today.year +1)

        if today <= this_year_bday <= upcoming:
            upcoming_birhdays.append(bday)
    return upcoming_birhdays


def update_birthday(session: Session, bday_id: int, data: BirthdayCreate):
    birthday = session.get(Birthday, bday_id)
    if not birthday:
        return None
    birthday.name = data.name
    birthday.date = data.date
    birthday.description = data.description
    birthday.email = data.email
    session.add(birthday)
    session.commit()
    session.refresh(birthday)
    return birthday

def delete_birthday(session: Session, bday_id: int):
    birthday = session.get(Birthday, bday_id)
    if not birthday:
        return None
    session.delete(birthday)
    session.commit()
    return birthday


# def send_sms(phone_number: str, name: str):
#     message = f"🎉 Happy Birthday, {name}!"
    
#     resp = requests.post('https://textbelt.com/text', {
#         'phone': phone_number,
#         'message': message,
#         'key': 'textbelt',  # Replace with your paid key for production
#     })

#     print(resp.json())  # For debugging

# async def send_birthday_wishes_today():
#     from database import engine
#     with Session(engine) as session:
#         today = date.today()
#         all_birthdays = session.exec(select(Birthday)).all()

#         for b in all_birthdays:
#             if b.date.month == today.month and b.date.day == today.day:
#                 send_sms(b.phone_number, b.name)




def send_email(to_email: str, name: str):
    from utils.config import EMAIL, APP_PASSWORD
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    from_email = EMAIL
    password = APP_PASSWORD

    subject = "🎉 Happy Birthday!"
    body = f"""
    <h3>🎂 Happy Birthday, {name}!</h3>
    <p>Wishing you a fantastic day filled with joy and celebration!</p>
    """

    message = MIMEMultipart()
    message["From"] = from_email
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(from_email, password)
            smtp.sendmail(from_email, to_email, message.as_string())

        logging.info(f"✅ Birthday email sent to {name} at {to_email}")
    except Exception as e:
        logging.error(f"❌ Failed to send email to {name} ({to_email}): {e}")



async def send_birthday_wishes_today():
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
                bday.last_sent = date.today()  # ✅ Update the last_sent timestamp
                session.add(bday)  # ✅ Add to session so it updates in DB
        session.commit() 



