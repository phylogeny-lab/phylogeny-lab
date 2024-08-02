import os
from pathlib import Path
from typing import BinaryIO
from fastapi import UploadFile
import aiofiles
from helper.minio_utils import upload_file, download_file

class GLPath:

    def __init__(
        self, 
        path: str | os.PathLike, 
        makedirs = False, 
        base_minio_path = os.environ.get('MINIO_VOLUME', "/volume"), 
        remove_special_chrs = True
    ):
        """
        Attributes
        ----------
        path : str | os.PathLike
            Filepath not including the base path.
        makedirs : bool
            Whether to create directories if don't already exist.
        base_minio_path | str
            Root directory for minio filestore.
        base_local_path: str
            Root directory for local directories.
        remove_spacial_chrs: bool
            Remove characters which can cause trouble.
        """
   
        self.path = path.removesuffix('/') # in case / is attached, the split below wouldn't work
        
        self.head, self.filename = os.path.split(self.path)

        if remove_special_chrs:
            self.path = self._remove_special_chrs(self.path)

        self.base_minio_path = base_minio_path  

        self.local = self.path
        self.minio = os.path.join(self.base_minio_path, self.path)

        if makedirs:
            os.makedirs(self.head, exist_ok=True)

    
    def upload_to_filestore(self, file: BinaryIO):
        """
        Parameters
        ----------
        file : BinaryIO
            File object to upload.
        """
        return upload_file(file_path=self.minio, data=file)
    
    def download_from_filestore(self):
        """
        Download a file from the filestore using saved attributes.
        """
        return download_file(self.filename, file_path=self.minio)

    def save_locally(self, file: UploadFile):
        """
        Parameters
        ----------
        file : UploadFile
            File object to upload, reads in a spooled file type.
        """
        if not os.path.exists(self.local):
            open(self.local, 'w+').close()
        with open(self.local, 'wb') as out_file:
            out_file.write(file.file.read()) 
    
    def _remove_special_chrs(self, str: str, special_chrs = [')', '(', ' '], replace_with='_'):
        """
        Parameters
        ----------
        str: str
            Original string to modify.
        special_chrs: List[str]
            Special characters to replace.
        replace_with: str
            Character to replace with.
        """
        for chr in special_chrs:
            str = str.replace(chr, replace_with)
        return str