from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import blast, blastdb, alignment
from .schemas.schemas import Base
from .config.database import engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(blast.router)
app.include_router(blastdb.router)
app.include_router(alignment.router)