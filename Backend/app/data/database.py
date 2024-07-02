from ..models.Blastdb import NcbiBlastdb
from datetime import datetime

databases = NcbiBlastdb(
    dbname="mouse_genome",
    version="1.2",
    dbtype="nucleotide",
    description="test desc",
    numLetters=12,
    numSequences=12,
    files=['dcmlkcml', 'kmflkmlem'],
    lastUpdated=datetime(year=2022, month=12, day=12),
    bytesToCache=123,
    numVolumes=2,
    bytesTotalCompressed=12,
    bytesTotal=123,
    status='installed'
)