from typing import BinaryIO
from minio import Minio
import os
import json
import io
from minio.datatypes import Object

from helper.utils import build_nested

bucket_name = os.getenv('MINIO_BUCKET_NAME')

def create_bucket_if_not_exists(client: Minio):
    
    found = client.bucket_exists(bucket_name)
    if not found:
        client.make_bucket(bucket_name)

def create_minio_client():

    client = Minio(
        os.getenv("MINIO_HOSTNAME")+":9000",
        access_key=os.getenv("MINIO_ACCESS_KEY"),
        secret_key=os.getenv("MINIO_SECRET_KEY"),
        secure=False
    )
    create_bucket_if_not_exists(client)

    return client


def upload_file(file_path: str | os.PathLike, data: BinaryIO, client = create_minio_client()):
    
    result = client.put_object(
        bucket_name=bucket_name,
        object_name=file_path,
        data=data,
        length=-1,
        part_size=10*1024*1024,
        content_type="application/json"
    )

    return {
        "file_path": file_path,
        "bucket_name": result.bucket_name,
        "etag": result.etag,
        "version_id": result.version_id
    }

def download_file(object_name, file_path, client = create_minio_client()):

    result = client.fget_object(
        bucket_name=bucket_name,
        object_name=object_name,
        file_path=file_path,
    )

    return {
        "file_path": file_path,
        "bucket_name": result.bucket_name,
        "etag": result.etag,
        "version_id": result.version_id
    }

def list_files(prefix, recursive = True, client = create_minio_client()):

    result = client.list_objects(
        bucket_name=bucket_name,
        prefix=prefix,
        recursive=recursive
    )

    tree = build_nested([obj for obj in result])
    
    return tree


  
  

