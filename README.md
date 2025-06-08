# Birthday Email Sender

This project is a Birthday Email Sender web application developed using **FastAPI**. The application allows users to add birthdays, stores them in a database, and automatically sends birthday wishes via email daily using a background task.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Workflow](#workflow)
- [Results](#results)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used

- **FastAPI**: For building the RESTful backend API.
- **SQLite**/**PostgreSQL**: For storing user birthday data.
- **SQLAlchemy**: ORM to interact with the database.
- **Pydantic**: For data validation and serialization.
- **APScheduler**: For running background tasks daily.
- **smtplib**: To send emails using the SMTP protocol.
- **email.message**: For composing structured email messages.
- **Uvicorn**: For running the FastAPI server.

## Features

- REST API to add, update, and view birthday entries.
- Automatically checks and sends birthday wishes every day.
- Sends personalized birthday emails.
- Stores data persistently in a database.
- Easy to integrate with frontends like React or mobile apps.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:  
   `git clone https://github.com/Prasad2357/birthday_email_sender.git`

2. Navigate to the project directory:  
   `cd birthday_email_sender`

3. (Optional) Create a virtual environment:  
   `python -m venv env && source env/bin/activate` (Linux/macOS)  
   `python -m venv env && env\Scripts\activate` (Windows)

4. Install dependencies:  
   `pip install -r requirements.txt`

5. Create a `.env` file and configure your SMTP credentials:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password_or_app_password


## Usage

1. Start the FastAPI server:

```bash
uvicorn main:app --reload
```

2. Use the API endpoints to manage birthdays (e.g., via Swagger UI at http://localhost:8000/docs).

3. The background task automatically checks for birthdays every day at a scheduled time and sends emails.

4. To run the background scheduler separately (if modularized), you can execute:

```bash
python scheduler.py
```

## Workflow
1. User adds birthday details using the API (name, email, date).

2. The data is saved into the database using SQLAlchemy models.

3. Every day, the APScheduler job runs in the background.

4. If a match for today’s date is found, an email is sent using SMTP.

## Results
1. All upcoming birthdays are automatically detected and wishes are sent.

2. Can be extended to send WhatsApp/SMS notifications.

3. Clean and modular codebase to allow easy enhancements.
