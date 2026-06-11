from sqlalchemy import inspect
from app.core.database import engine
from app.core.database import Base
import app.models.run
import app.models.execution
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def wait_for_db():
    retries = 5
    while retries > 0:
        try:
            with engine.connect() as conn:
                logger.info("Successfully connected to the database")
                return
        except Exception as e:
            logger.warning(f"Database not ready, retrying in 2 seconds... ({retries} retries left)")
            retries -= 1
            time.sleep(2)
    logger.error("Could not connect to the database")
    raise Exception("Database connection failed")

def init_db():
    wait_for_db()
    logger.info("Creating tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created.")

if __name__ == "__main__":
    init_db()
