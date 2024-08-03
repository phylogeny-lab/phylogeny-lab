from typing import Annotated, Union
from fastapi import APIRouter, Form, UploadFile


router = APIRouter(
    prefix="/api/featureselection",
    tags=['feature_selection', 'pca']
)

router.post("/vectorize")
def vectorize(
    data: Annotated[str, Form()], 
    sequenceFile: Union[UploadFile, None] = None,
):
    pass # return id for vectorized files

router.post("/pca/{id}")
def pca(id: str):
    pass