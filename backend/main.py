from fastapi import FastAPI
from contextlib import asynccontextmanager
from backend.database.database import create_db_and_tables
from backend.routes import birthday
from fastapi.middleware.cors import CORSMiddleware
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from backend.services.birthday import (
    send_daily_reminder,
    send_weekly_reminder,
    send_monthly_reminder,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()

    # ── Daily reminder: every day at 09:00 ──────────────────────────────────
    scheduler.add_job(
        send_daily_reminder,
        CronTrigger(hour=9, minute=0),
        id="daily_reminder",
        replace_existing=True,
    )

    # ── Weekly reminder: every Monday at 09:00 ──────────────────────────────
    scheduler.add_job(
        send_weekly_reminder,
        CronTrigger(day_of_week="mon", hour=9, minute=0),
        id="weekly_reminder",
        replace_existing=True,
    )

    # ── Monthly reminder: 1st of every month at 09:00 ───────────────────────
    scheduler.add_job(
        send_monthly_reminder,
        CronTrigger(day=1, hour=9, minute=0),
        id="monthly_reminder",
        replace_existing=True,
    )

    scheduler.start()
    logging.info("🗓  Birthday reminder scheduler started.")

    yield

    scheduler.shutdown()
    logging.info("Scheduler shut down.")


app = FastAPI(
    title="Birthday Reminder",
    description="Sends YOU reminder emails for upcoming birthdays.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(birthday.router)
