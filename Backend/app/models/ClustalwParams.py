from typing import Literal
from pydantic import BaseModel

class ClustalwParams(BaseModel):
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
	outfile: str = None 
	numiter: int = None
	clustering: Literal['NJ', 'UPGMA']
	maxseqlen: int = None
	stats: str = None 
