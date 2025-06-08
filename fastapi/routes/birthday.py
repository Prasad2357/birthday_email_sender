from fastapi import APIRouter
from services import birthday as birthday_service
from models.birthday import BirthdayCreate
from database.database import SessionDep


router = APIRouter(prefix="/birthdays",
                   tags=["Birthdays"])

# @router.get("/")
# def read_root():
#     return {"message": "Birthdays Reminder"}

@router.get("/send-emails-now")
async def test_send_emails():
    await birthday_service.send_birthday_wishes_today()
    return {"message": "Triggered birthday email check"}

@router.post("/")
def create_birthday(data: BirthdayCreate, session: SessionDep):
    return birthday_service.create_birthday(session, data)

@router.get("/")
def get_birthdays(session: SessionDep):
    return birthday_service.get_all_birthdays(session)

@router.get("/{bday_id}")
def get_birthday(bday_id: int, session: SessionDep):
    birthday = birthday_service.get_birthday(session, bday_id)
    return birthday or {"error": "Birthday not found"}

@router.get("/month/{month}")
def get_birthday_by_month(month:int, session:SessionDep):
    return birthday_service.get_birthday_by_month(session,month)

@router.get("/upcoming/{days}")
def get_birthday_in_next_days(days:int, session: SessionDep):
    return birthday_service.get_birthday_in_next_days(session, days)

@router.put("/{bday_id}")
def update_birthday(bday_id: int, data: BirthdayCreate, session: SessionDep):
    updated = birthday_service.update_birthday(session, bday_id, data)
    return {"message": "Birthday updated successfully", "updated_birthday": updated} if updated else {"error": "Birthday not found"}

@router.delete("/{bday_id}")
def delete_birthday(bday_id: int, session: SessionDep):
    deleted = birthday_service.delete_birthday(session, bday_id)
    return {"message": "Birthday deleted successfully"} if deleted else {"error": "Birthday not found"}


# @router.post("/send-test-sms/{bday_id}")
# def send_test_sms(bday_id: int, session: SessionDep):
#     birthday = birthday_service.get_birthday(session, bday_id)
#     if not birthday:
#         return {"error": "Birthday not found"}
#     birthday_service.send_sms(birthday.phone_number, birthday.name)
#     return {"message": "SMS sent (test)"}



