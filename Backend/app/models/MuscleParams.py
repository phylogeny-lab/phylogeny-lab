from datetime import date
from typing import Literal, Optional
from pydantic import BaseModel

class MuscleParams(BaseModel):
	id: Optional[str] = None
	jobTitle: str
	status: Optional[str] = None
	created_at: Optional[date] = None
	input: str = None
	seed: int = None
	outformat: Literal['GCG', 'GDE', 'PIR', 'PHYLIP', 'NEXUS', 'FASTA', 'CLUSTAL', 'AFA']
	out: str = None 
	consiters: int = None
	refineiters: int = None
	perm: str = None
	perturb: int = None
	threads: int = None