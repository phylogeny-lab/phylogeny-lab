import os
from pathlib import Path

class GLPath:

    def __init__(self, parent: str, id: str, subdir: str, filename: str, makedirs = False):

        BASE_MINIO_PATH = os.getenv('MINIO_VOLUME')
        BASE_LOCAL_PATH = '/tmp' # temp storage of local files

        if makedirs:
            os.makedirs(os.path.join(BASE_LOCAL_PATH, parent, id, subdir), exist_ok=True)

        self.local = os.path.join(BASE_LOCAL_PATH, parent, id, subdir, filename)
        self.minio = os.path.join(BASE_MINIO_PATH, parent, id, subdir, filename)

        self.filename = filename

    @staticmethod
    def parse(path: str, makedirs = False):
        dirs = Path(path).parts[2:] # remove first level folder (tmp or minio-volume)

        return GLPath(parent=dirs[0], id=dirs[1], subdir=dirs[2], filename=dirs[3], makedirs=makedirs)