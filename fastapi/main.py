from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.database import create_db_and_tables
from routes import birthday
from fastapi.middleware.cors import CORSMiddleware 
import asyncio
from services.birthday import send_birthday_wishes_today
import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()

    asyncio.create_task(background_birthday_checker())

    yield

async def background_birthday_checker():
    while True:
        try:
            await send_birthday_wishes_today()
            logging.info("Birthday emails checked and sent if needed.")
        except Exception as e:
            logging.error(f"Error in birthday email task: {e}")
        await asyncio.sleep(86400)  # Sleep 24 hours

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(birthday.router)
