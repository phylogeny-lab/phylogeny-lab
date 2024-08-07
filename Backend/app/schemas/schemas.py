from ..config.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP, ARRAY

class BlastQueries(Base):
    __tablename__ = "BlastQueries"

    id = Column(String, primary_key=True, nullable=False)
    algorithm = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    db = Column(String, nullable=False)
    entrezQuery = Column(String, nullable=True)
    evalue = Column(Float, nullable=True)
    gapextend = Column(Integer, nullable=False)
    gapopen = Column(Integer, nullable=False)
    jobTitle = Column(String, nullable=False)
    max_hsps = Column(Integer, nullable=True)
    organism = Column(String, nullable=True)
    penalty = Column(Integer, nullable=False)
    perc_identity = Column(Integer, nullable=True)
    reward = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    taxids = Column(String, nullable=True)
    ungapped = Column(Boolean, nullable=True)
    word_size = Column(Integer, nullable=False)

class AlignmentJobs(Base):
    __tablename__ = "AlignmentJobs"

    id = Column(String, primary_key=True, nullable=False)
    jobTitle = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    status = Column(String, nullable=False)
    algorithm = Column(String, nullable=False)


class BlastDB(Base):
    __tablename__ = "BlastDB"

    id = Column(String, primary_key=True)
    dbname = Column(String, nullable=False)
    version = Column(String, nullable=True)
    dbtype = Column(String, nullable=True)
    description = Column(String, nullable=True)
    filepath = Column(String, nullable=True, unique=True)
    numLetters = Column(Integer, nullable=True)
    numSequences = Column(Integer, nullable=True)
    lastUpdated = Column(DateTime, nullable=True)
    bytesTotal = Column(Integer, nullable=True)
    status = Column(String, nullable=False)
    ncbidb = Column(Boolean, nullable=False)

class ClustalwJobs(Base):
    __tablename__ = "ClustalwJobs"

    id = Column(String, ForeignKey('AlignmentJobs.id', ondelete="CASCADE"), primary_key=True)
    align = Column(Boolean, nullable=True)
    bootstrap = Column(Integer, nullable=True) 
    tree = Column(Boolean, nullable=True) 
    infile = Column(String, nullable=False)
    type = Column(String, nullable=False)
    matrix = Column(String, nullable=True)
    dnamatrix = Column(String, nullable=True)
    gapopen = Column(Float, nullable=True)
    gapext = Column(Float, nullable=True)
    seed = Column(Integer, nullable=True)
    kimura = Column(Boolean, nullable=True)
    output = Column(String, nullable=True)
    outputtree = Column(String, nullable=True)
    outorder = Column(String, nullable=True)
    outfile = Column(String, nullable=False)
    numiter = Column(Integer, nullable=True)
    clustering = Column(String, nullable=True)
    maxseqlen = Column(Integer, nullable=True)
    stats = Column(String, nullable=True) 

class DimReduction(Base):
    __tablename__ = "DimReduction"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    sequenceFilePaths = Column(ARRAY(String), nullable=False)
    algorithm = Column(String, nullable=False)
    kmers = Column(Integer, nullable=False)
    batch_size = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    status = Column(String, nullable=False)