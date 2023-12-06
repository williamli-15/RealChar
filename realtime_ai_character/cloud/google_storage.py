
import os

from google.cloud import storage

DEFAULT_BUCKET_NAME = os.getenv('GOOGLE_STORAGE_BUCKET_NAME')

CLIENT = storage.Client.from_service_account_json(
    os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
)


def upload_blob(source_file_name, destination_blob_name, bucket_name=DEFAULT_BUCKET_NAME):
    """Uploads a file to the bucket."""
    bucket = CLIENT.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)
    return blob.public_url
