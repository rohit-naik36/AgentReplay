FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y libpq-dev gcc

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run script to init db, seed db, and start server
CMD python -m scripts.init_db && python -m scripts.seed_db && uvicorn app.main:app --host 0.0.0.0 --port 8000
