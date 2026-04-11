from fastapi import APIRouter, HTTPException, UploadFile, File
from backend.services import birthday as birthday_service
from backend.models.birthday import BirthdayCreate, BirthdayRead, Birthday
from backend.database.database import SessionDep
from backend.utils.birthday_parser import parse_birthday_text
from typing import List
import logging

router = APIRouter(prefix="/birthdays", tags=["Birthdays"])


# ── CRUD ─────────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[BirthdayRead])
def get_birthdays(session: SessionDep):
    return birthday_service.get_all_birthdays(session)


@router.post("/", response_model=BirthdayRead)
def create_birthday(data: BirthdayCreate, session: SessionDep):
    # Fuzzy-check before inserting
    dup = birthday_service.find_duplicate(session, data.name, data.date)
    if dup:
        raise HTTPException(
            status_code=409,
            detail=f"Possible duplicate found: '{dup.name}' on {dup.date.strftime('%d %b')} (id={dup.bday_id})"
        )
    return birthday_service.create_birthday(session, data)


@router.get("/month/{month}", response_model=List[BirthdayRead])
def get_by_month(month: int, session: SessionDep):
    return birthday_service.get_birthday_by_month(session, month)


@router.get("/upcoming/{days}", response_model=List[BirthdayRead])
def get_upcoming(days: int, session: SessionDep):
    return birthday_service.get_birthday_in_next_days(session, days)


@router.get("/{bday_id}", response_model=BirthdayRead)
def get_birthday(bday_id: int, session: SessionDep):
    b = birthday_service.get_birthday(session, bday_id)
    if not b:
        raise HTTPException(status_code=404, detail="Birthday not found")
    return b


@router.put("/{bday_id}", response_model=BirthdayRead)
def update_birthday(bday_id: int, data: BirthdayCreate, session: SessionDep):
    updated = birthday_service.update_birthday(session, bday_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Birthday not found")
    return updated


@router.delete("/{bday_id}")
def delete_birthday(bday_id: int, session: SessionDep):
    deleted = birthday_service.delete_birthday(session, bday_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Birthday not found")
    return {"message": f"Deleted '{deleted.name}' successfully"}


# ── MANUAL TRIGGER ENDPOINTS (for testing) ───────────────────────────────────

@router.post("/reminders/daily")
async def trigger_daily():
    """Manually trigger today's birthday reminder email."""
    birthday_service.send_daily_reminder()
    return {"message": "Daily reminder sent"}


@router.post("/reminders/weekly")
async def trigger_weekly():
    """Manually trigger this week's birthday reminder email."""
    birthday_service.send_weekly_reminder()
    return {"message": "Weekly reminder sent"}


@router.post("/reminders/monthly")
async def trigger_monthly():
    """Manually trigger this month's birthday reminder email."""
    birthday_service.send_monthly_reminder()
    return {"message": "Monthly reminder sent"}


# ── FILE UPLOAD ───────────────────────────────────────────────────────────────

@router.post("/upload-file")
async def upload_birthday_file(session: SessionDep, file: UploadFile = File(...)):
    """
    Upload a .txt birthday file to bulk-import entries into the DB.

    Accepted line format:  DD Mon - Name   (e.g. "4 Jan - Aaji")
    Month section headers (e.g. "JANUARY") and blank lines are ignored.

    Before inserting, each entry is fuzzy-checked against the DB
    (80% name similarity + same day) to prevent duplicates.

    Returns a detailed report of inserted, skipped, and unparseable lines.
    """
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files are accepted.")

    raw_bytes = await file.read()
    try:
        text = raw_bytes.decode("utf-8")
    except UnicodeDecodeError:
        text = raw_bytes.decode("latin-1")  # fallback encoding

    parsed_entries, unparseable = parse_birthday_text(text)

    if not parsed_entries and not unparseable:
        raise HTTPException(status_code=422, detail="File appears to be empty or has no recognisable entries.")

    inserted = []
    skipped  = []

    for entry in parsed_entries:
        duplicate = birthday_service.find_duplicate(session, entry.name, entry.date)
        if duplicate:
            skipped.append({
                "name": entry.name,
                "date": entry.date.strftime("%d %b"),
                "reason": "duplicate",
                "matched_to": duplicate.name,
                "matched_id": duplicate.bday_id,
            })
            logging.info(f"⏭  SKIP (duplicate): {entry.name!r} → matched '{duplicate.name}'")
        else:
            new_entry = birthday_service.create_birthday(
                session,
                BirthdayCreate(name=entry.name, date=entry.date)
            )
            inserted.append({
                "id": new_entry.bday_id,
                "name": new_entry.name,
                "date": new_entry.date.strftime("%d %b"),
            })
            logging.info(f"✅ INSERTED: {entry.name!r} on {entry.date.strftime('%d %b')}")

    return {
        "summary": {
            "total_parsed":    len(parsed_entries),
            "inserted":        len(inserted),
            "skipped_duplicates": len(skipped),
            "unparseable_lines":  len(unparseable),
        },
        "inserted": inserted,
        "skipped":  skipped,
        "unparseable_lines": unparseable,
    }
