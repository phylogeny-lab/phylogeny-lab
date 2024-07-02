from pydantic import BaseModel
from typing import Annotated, Optional, List
from fastapi import File
from .BlastParams import BlastParams
from datetime import date

# These models closely resemble the XML output format for blast alignments

class Hsp(BaseModel):
    num: int = None
    bitScore: float = None
    score: int = None
    evalue: float = None
    queryFrom: int = None
    queryTo: int = None
    hitFrom: int = None
    hitTo: int = None
    queryFrame: int = None
    hitFrame: int = None
    identity: int = None
    positive: int = None
    gaps: int = None
    alignLen: int = None
    qseq: str = None
    hseq: str = None
    midline: str = None

class Hit(BaseModel):
    num: int = None
    hitId: str = None
    hitDef: str = None
    hitAccession: str = None
    hitLen: int = None
    hitHsps: List[Hsp]

class Statistics(BaseModel):
    num: int = None
    len: int = None
    hspLen: int = None
    effSpace: int = None
    kappa: float = None
    lmbda: float = None
    entropy: float = None


class Iteration(BaseModel):
    num: int = None
    queryDef: str = None
    queryLen: str = None
    queryLen: int = None
    hits: List[Hit]
    statistics: List[Statistics]

class BlastOutput(BaseModel):
    algorithm: str = None
    version: str = None
    db: str = None
    queryID: str = None
    queryDef: str = None
    queryLen: int = None
    parameters: BlastParams
    iterations: List[Iteration]









    