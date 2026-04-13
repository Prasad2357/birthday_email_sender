from sqlmodel import Session, select
from backend.models.birthday import Birthday, BirthdayCreate
from sqlalchemy import extract
from datetime import date, timedelta
from backend.utils.config import MY_EMAIL, APP_PASSWORD, SENDER_EMAIL
from backend.database.database import engine
import smtplib
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from difflib import SequenceMatcher
from pathlib import Path

_LOG_FILE = Path(__file__).parent / "birthday_email.log"
_TRACKER_FILE = Path(__file__).resolve().parent.parent / "database" / "reminder_tracker.json"

logging.basicConfig(
    filename=str(_LOG_FILE),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)


# ─────────────────────────────────────────────
#  CRUD
# ─────────────────────────────────────────────

def create_birthday(session: Session, data: BirthdayCreate) -> Birthday:
    birthday = Birthday.model_validate(data)
    session.add(birthday)
    session.commit()
    session.refresh(birthday)
    return birthday


def get_all_birthdays(session: Session):
    birthdays = session.exec(select(Birthday)).all()
    return sorted(birthdays, key=lambda b: (b.date.month, b.date.day))


def get_birthday(session: Session, bday_id: int):
    return session.get(Birthday, bday_id)


def get_birthday_by_month(session: Session, month: int):
    all_bdays = session.exec(select(Birthday)).all()
    return [b for b in all_bdays if b.date.month == month]


def get_birthday_in_next_days(session: Session, days: int = 7):
    today = date.today()
    upcoming_date = today + timedelta(days=days)
    birthdays = session.exec(select(Birthday)).all()
    result = []
    for bday in birthdays:
        bday_this_year = bday.date.replace(year=today.year)
        if bday_this_year < today:
            bday_this_year = bday_this_year.replace(year=today.year + 1)
        if today <= bday_this_year <= upcoming_date:
            result.append(bday)
    return result


def update_birthday(session: Session, bday_id: int, data: BirthdayCreate):
    birthday = session.get(Birthday, bday_id)
    if not birthday:
        return None
    birthday.name = data.name
    birthday.date = data.date
    birthday.notes = data.notes
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


# ─────────────────────────────────────────────
#  FUZZY DUPLICATE CHECK
# ─────────────────────────────────────────────

def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()


def find_duplicate(session: Session, name: str, bday_date: date, threshold: float = 0.80):
    """Return existing Birthday if a fuzzy match exists (same day + similar name).
    Uses Python-side filtering for SQLite compatibility."""
    all_birthdays = session.exec(select(Birthday)).all()
    for c in all_birthdays:
        if c.date.month == bday_date.month and c.date.day == bday_date.day:
            if _similarity(c.name, name) >= threshold:
                return c
    return None


# ─────────────────────────────────────────────
#  EMAIL HELPERS
# ─────────────────────────────────────────────

def _send_email(subject: str, html_body: str):
    """Send a reminder email to MY_EMAIL."""
    message = MIMEMultipart("alternative")
    message["From"] = SENDER_EMAIL
    message["To"] = MY_EMAIL
    message["Subject"] = subject
    message.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(SENDER_EMAIL, APP_PASSWORD)
            smtp.sendmail(SENDER_EMAIL, MY_EMAIL, message.as_string())
        logging.info(f"✅ Reminder email sent: {subject}")
    except Exception as e:
        logging.error(f"❌ Failed to send reminder email: {e}")
        raise


def _birthday_table_rows(birthdays: list[Birthday]) -> str:
    rows = ""
    for b in birthdays:
        notes = f" <em style='color:#888'>({b.notes})</em>" if b.notes else ""
        rows += f"""
        <tr>
          <td style="padding:8px 16px; border-bottom:1px solid #2a2a3a;">{b.name}{notes}</td>
          <td style="padding:8px 16px; border-bottom:1px solid #2a2a3a; color:#c084fc;">
            {b.date.strftime("%d %B")}
          </td>
        </tr>"""
    return rows


def _build_email_html(title: str, subtitle: str, birthdays: list[Birthday]) -> str:
    rows = _birthday_table_rows(birthdays)
    count = len(birthdays)
    return f"""
    <html><body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:560px;margin:32px auto;background:#1a1a2e;border-radius:16px;overflow:hidden;
                box-shadow:0 8px 32px rgba(0,0,0,0.5);">
      <div style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:28px 32px;">
        <h1 style="margin:0;color:#fff;font-size:24px;">🎂 Birthday Reminder</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">{title}</p>
      </div>
      <div style="padding:24px 32px;">
        <p style="color:#a0aec0;margin:0 0 20px;">{subtitle} — <strong style="color:#fff">{count}</strong> birthday{"s" if count != 1 else ""} coming up.</p>
        <table width="100%" cellpadding="0" cellspacing="0"
               style="border-collapse:collapse;background:#12122a;border-radius:10px;overflow:hidden;">
          <thead>
            <tr style="background:#7c3aed;">
              <th style="padding:10px 16px;text-align:left;color:#fff;font-weight:600;">Name</th>
              <th style="padding:10px 16px;text-align:left;color:#fff;font-weight:600;">Birthday</th>
            </tr>
          </thead>
          <tbody style="color:#e2e8f0;">{rows}</tbody>
        </table>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #2a2a3a;text-align:center;">
        <p style="color:#4a5568;font-size:12px;margin:0;">Birthday Reminder System · auto-generated</p>
      </div>
    </div>
    </body></html>
    """


# ─────────────────────────────────────────────
#  DEDUPLICATION TRACKER  (JSON file)
# ─────────────────────────────────────────────

def _load_tracker() -> dict:
    """Load the reminder tracker from disk."""
    if _TRACKER_FILE.exists():
        try:
            return json.loads(_TRACKER_FILE.read_text())
        except (json.JSONDecodeError, OSError):
            return {}
    return {}


def _save_tracker(data: dict):
    """Persist the reminder tracker to disk."""
    _TRACKER_FILE.write_text(json.dumps(data, default=str))


def _already_sent(reminder_type: str, period_key: str) -> bool:
    """Return True if a reminder of this type was already sent for the given period."""
    return _load_tracker().get(reminder_type) == period_key


def _mark_sent(reminder_type: str, period_key: str):
    """Record that a reminder of this type was sent for the given period."""
    tracker = _load_tracker()
    tracker[reminder_type] = period_key
    _save_tracker(tracker)


# ─────────────────────────────────────────────
#  SCHEDULED REMINDER SENDERS
# ─────────────────────────────────────────────

def send_daily_reminder():
    """Send reminder for TODAY's birthdays."""
    today = date.today()
    with Session(engine) as session:
        all_bdays = session.exec(select(Birthday)).all()
        birthdays = [
            b for b in all_bdays
            if b.date.month == today.month and b.date.day == today.day and b.last_reminded != today
        ]
        if not birthdays:
            logging.info("No birthdays today — skipping daily reminder.")
            return
        subject = f"🎂 Birthday Today – {today.strftime('%d %B %Y')}"
        subtitle = f"Today is {today.strftime('%A, %d %B %Y')}"
        html = _build_email_html("Daily Reminder", subtitle, birthdays)
        _send_email(subject, html)

        # mark last_reminded
        for b in birthdays:
            b.last_reminded = today
            session.add(b)
        session.commit()


def send_weekly_reminder():
    """Send reminder for this week's birthdays (Mon–Sun)."""
    today = date.today()
    iso = today.isocalendar()
    week_key = f"{iso.year}-W{iso.week:02d}"
    if _already_sent("weekly", week_key):
        logging.info("Weekly reminder already sent for %s — skipping.", week_key)
        return

    week_end = today + timedelta(days=6)
    with Session(engine) as session:
        all_bdays = session.exec(select(Birthday)).all()
        this_week = []
        for b in all_bdays:
            bday_this_year = b.date.replace(year=today.year)
            if bday_this_year < today:
                bday_this_year = bday_this_year.replace(year=today.year + 1)
            if today <= bday_this_year <= week_end:
                this_week.append(b)

        if not this_week:
            logging.info("No birthdays this week — skipping weekly reminder.")
            return

        subject = f"📅 Weekly Birthday List – {today.strftime('%d %b')} to {week_end.strftime('%d %b %Y')}"
        subtitle = f"Week of {today.strftime('%d %B')} – {week_end.strftime('%d %B %Y')}"
        html = _build_email_html("Weekly Reminder", subtitle, this_week)
        _send_email(subject, html)
        _mark_sent("weekly", week_key)


def send_monthly_reminder():
    """Send reminder for this month's birthdays."""
    today = date.today()
    month_key = f"{today.year}-{today.month:02d}"
    if _already_sent("monthly", month_key):
        logging.info("Monthly reminder already sent for %s — skipping.", month_key)
        return

    with Session(engine) as session:
        all_bdays = session.exec(select(Birthday)).all()
        birthdays = sorted(
            [b for b in all_bdays if b.date.month == today.month],
            key=lambda b: b.date.day
        )

        if not birthdays:
            logging.info("No birthdays this month — skipping monthly reminder.")
            return

        month_name = today.strftime("%B %Y")
        subject = f"📆 Birthday List for {month_name}"
        subtitle = f"All birthdays in {month_name}"
        html = _build_email_html("Monthly Reminder", subtitle, birthdays)
        _send_email(subject, html)
        _mark_sent("monthly", month_key)
