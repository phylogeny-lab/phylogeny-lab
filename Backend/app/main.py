import asyncio
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import blast, blastdb, alignment
from .schemas.schemas import Base
from .config.database import engine, get_db
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from .schemas import schemas
from sqlalchemy import select, delete
from .enums.enums import CeleryStatus


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        #await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

        stmt_delete_pending_queries = delete(schemas.BlastQueries).where(schemas.BlastQueries.status == CeleryStatus.STARTED.value)
        await conn.execute(stmt_delete_pending_queries)
        stmt_delete_pending_dbs = delete(schemas.BlastDB).where(schemas.BlastDB.status == "installing")
        await conn.execute(stmt_delete_pending_dbs)
        
    
    yield
    print("Closing application.. put code on shutdown here")

app = FastAPI(lifespan=lifespan)

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