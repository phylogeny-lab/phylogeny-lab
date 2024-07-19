from fastapi import APIRouter
import os

router = APIRouter(
    prefix="/api/blast",
    tags=['Blast']
)

def list_directory_tree_with_os_walk(starting_directory):
    for root, directories, files in os.walk(starting_directory):
        for file in files:
            print("hi")
            

@router.get('/')
def volume():
    root = os.getenv('SHARED_VOLUME')
