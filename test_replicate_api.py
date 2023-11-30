

import os

import replicate

os.environ['REPLICATE_API_TOKEN'] = ''
os.environ['HTTP_PROXY'] = 'http://127.0.0.1:4780'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:4780'
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'gcs.json'


# output = replicate.run(
#     "devxpy/cog-wav2lip:8d65e3f4f4298520e079198b493c25adfc43c058ffec924f2aefc8010ed25eef",
#     input={
#         "fps": 25,
#         "face": "https://storage.googleapis.com/avatars_bucket/Talking_Head_Videos.mp4",
#         "pads": "0 10 0 0",
#         "audio": "https://replicate.delivery/mgxm/ac8a126d-1222-4ae4-98f9-8f7dd3e1c598/dictator_audio_extracted.wav",
#         "smooth": True,
#         "resize_factor": 1
#     }
# )
#
# print(output)


# client = storage.Client.from_service_account_json('gcs.json')

# list bucket
# buckets = client.list_buckets()
# for bucket in buckets:
#     print(bucket.name)
# bucket = client.get_bucket('audio_bucket-01')
# upload local file
# blob = bucket.blob('requirements.txt')
# blob.upload_from_filename('requirements.txt')

# list files in bucket
# files = bucket.list_blobs()
# for file in files:
#     print(file.name)
#     print(file.public_url)

import asyncio
import aiofiles
import aiohttp
from gcloud.aio.storage import Storage


async def upload_blob(bucket_name, source_file_name, destination_blob_name):
    async with aiohttp.ClientSession() as session:
        client = Storage(session=session, service_file='gcs.json')
        status = await client.upload_from_filename(
            bucket_name,
            destination_blob_name,
            source_file_name,
        )
        print(status)


async def main():
    # 设置你的 Google Cloud Storage 存储桶和文件信息
    bucket_name = 'audio_bucket-01'
    local_file_path = 'LICENSE'
    destination_blob_name = 'LICENSE'
    # 调用异步上传函数
    await upload_blob(bucket_name, local_file_path, destination_blob_name)


# 运行异步主函数
asyncio.run(main())


