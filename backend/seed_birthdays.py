"""
seed_birthdays.py
-----------------
Parses the birthday list and inserts into the DB.
Fuzzy-checks for duplicates before inserting (threshold 80% name similarity + same day).

Run from the project root:
    python -m backend.seed_birthdays
"""

from datetime import date
from sqlmodel import Session, select
from backend.database.database import engine, create_db_and_tables
from backend.models.birthday import Birthday
from backend.services.birthday import find_duplicate

# ──────────────────────────────────────────────────────────────
#  RAW BIRTHDAY DATA
# ──────────────────────────────────────────────────────────────

RAW_BIRTHDAYS = [
    # (name, month, day)
    # ── January ──
    ("Abhishek Kadam",          1,  1),
    ("Aaji",                    1,  4),
    ("Abhay Ingavale",          1,  8),
    ("Prajwal",                 1, 16),
    ("Mandar Dhage",            1, 22),
    ("Suvendu",                 1, 24),
    ("Ashwin",                  1, 24),
    ("Shinde mama",             1, 26),
    ("Shubham Yadav",           1, 30),
    ("Suyog Jagadale",          1, 30),
    # ── February ──
    ("Vaishnavi",               2,  1),
    ("Chinmay",                 2,  7),
    ("Vaibhav aba",             2, 10),
    ("Aniket (Bunty)",          2, 12),
    ("Utkarsh Bhlasing",        2, 23),
    ("Sakshi Vasav",            2, 26),
    ("Utkarsha",                2, 28),
    # ── March ──
    ("Harshvardhan Dudhe",      3,  1),
    ("Lavlesh bhaiya",          3,  2),
    ("Siddesh Hirve",           3,  2),
    ("Veda",                    3,  4),
    ("Aditya Shelar",           3,  8),
    ("Kshitij Narkhede",        3, 10),
    ("Abhishek Jagadale (Babu)",3, 11),
    ("Pranav Babar",            3, 13),
    ("Yash Gaikwad",            3, 16),
    ("Dhiraj dada",             3, 28),
    ("Viresh",                  3, 31),
    # ── April ──
    ("Siddeshvar",              4,  2),
    ("Shubham Bhilare",         4,  3),
    ("Nitesh Navale (Toto)",    4,  8),
    ("Akshay Shelar",           4,  9),
    ("Atharv Tembhurnikar",     4, 21),
    ("Kittu dada",              4, 13),
    ("Gaurav Pisal",            4, 23),
    # ── May ──
    ("Pooja didi",              5, 11),
    ("Vedant Bhise",            5, 11),
    ("Pariyashi Sahu",          5, 21),
    # ── June ──
    ("Adi Swami",               6,  6),
    ("Sanket More",             6, 19),
    ("Yash Jadhav",             6, 20),
    ("Mummy & Papa",            6, 25),
    ("Siddharth Bandal",        6, 29),
    # ── July ──
    ("Rohan More",              7, 25),
    ("Suraj Suryawanshi",       7, 28),
    # ── August ──
    ("Tanish Mokashi",          8,  2),
    ("Snehal Jagadale",         8, 13),
    ("Sourabh Dere",            8, 19),
    ("Aarush",                  8, 27),
    ("Pratik Waghmare",         8, 31),
    # ── September ──
    ("Ankita Mandhare",         9,  2),
    ("Aatya (Shilpa)",          9,  5),
    ("Bhushan Pisal",           9,  5),
    ("Sahil Waragade",          9, 20),
    # ── October ──
    ("Atharv Kamble",          10,  3),
    ("Omkar Mardhekar",        10, 10),
    ("Abhishek Katare",        10, 24),
    ("Mummy",                  10, 25),
    ("Papa",                   10, 28),
    ("Anuja",                  10, 30),
    # ── November ──
    ("Manav Bobade",           11, 18),
    ("Tanmay Patil",           11, 20),
    ("Aarya Gowda",            11, 26),
    ("Kartik Shinde",          11, 28),
    ("Rajlaxmi Kasurde",       11, 28),
    # ── December ──
    ("Sachin Nakate",          12,  7),
    ("Anuradha",               12,  8),
]


# ──────────────────────────────────────────────────────────────
#  SEEDER
# ──────────────────────────────────────────────────────────────

def seed():
    create_db_and_tables()
    inserted = 0
    skipped = 0

    with Session(engine) as session:
        for name, month, day in RAW_BIRTHDAYS:
            # Use a fixed "seed year" – only month & day matter
            bday_date = date(2000, month, day)

            duplicate = find_duplicate(session, name, bday_date, threshold=0.80)
            if duplicate:
                print(f"  ⏭  SKIP (duplicate) : {name!r:35s} → matched '{duplicate.name}' on {bday_date.strftime('%d %b')}")
                skipped += 1
                continue

            entry = Birthday(name=name, date=bday_date)
            session.add(entry)
            print(f"  ✅ INSERTED          : {name!r:35s} on {bday_date.strftime('%d %b')}")
            inserted += 1

        session.commit()

    print(f"\n🎂 Done! Inserted: {inserted}  |  Skipped (duplicates): {skipped}")


if __name__ == "__main__":
    seed()
