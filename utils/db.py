from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.sql.schema import Column

import requests

from pydantic import BaseModel
# 연결할 db url

# read db url from .env file
import os
from dotenv import load_dotenv

load_dotenv(verbose=True, dotenv_path= os.path.join(__file__.replace(r"\utils\db.py", ""), "connected_back\.env"))

SQLALCHEMY_DB_USER = os.getenv("DB_USER")
SQLALCHEMY_DB_PASSWORD = os.getenv("DB_PASSWORD")
SQLALCHEMY_DB_HOST = os.getenv("DB_HOST")
SQLALCHEMY_DB_PORT = os.getenv("DB_PORT")
SQLALCHEMY_DB_DATABASE = os.getenv("DB_DATABASE")

TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

SQLALCHEMY_DATABASE_URL = f"mysql://{SQLALCHEMY_DB_USER}:{SQLALCHEMY_DB_PASSWORD}@{SQLALCHEMY_DB_HOST}:{SQLALCHEMY_DB_PORT}/{SQLALCHEMY_DB_DATABASE}"


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except:
        db.close()



class Video(Base):
    __tablename__ = "video"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    genre = Column(String, nullable=False)
    thumbnailUrl = Column(String, nullable=False)
    youtubeUrl = Column(String, nullable=False)


# db = next(get_db())

# video_list = db.query(Video).all()

