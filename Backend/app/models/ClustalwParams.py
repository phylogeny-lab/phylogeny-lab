from datetime import date
from typing import Literal, Optional
from pydantic import BaseModel

class ClustalwParams(BaseModel):
	id: Optional[str] = None
	jobTitle: str
	status: Optional[str] = None
	created_at: Optional[date] = None
	align: bool = True
	bootstrap: int = 1000 
	tree: bool = True 
	infile: str = None
	type: Literal['PROTEIN', 'DNA']
	matrix: str = None
	dnamatrix: str = None
	gapopen: float = None
	gapext: float = None
	seed: int = None
	kimura: bool = None
	output: Literal['GCG', 'GDE', 'PIR', 'PHYLIP', 'NEXUS', 'FASTA', 'CLUSTAL']
	outputtree: Literal['NJ', 'PHYLIP', 'DIST', 'NEXUS']
	outorder: Literal['INPUT', 'ALIGNMENT']
	outfile: str = None 
	numiter: int = None
	clustering: Literal['NJ', 'UPGMA']
	maxseqlen: int = None
	stats: str = None 
