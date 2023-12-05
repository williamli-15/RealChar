import os

import replicate


def generate_video(
        face_url: str,
        audio_url: str,
):
    """
    video url
    """
    video_url = replicate.run(
        "devxpy/cog-wav2lip:8d65e3f4f4298520e079198b493c25adfc43c058ffec924f2aefc8010ed25eef",
        input={
            "fps": 25,
            # "face": face_url,
            "face": "https://storage.googleapis.com/avatars_bucket/lisa-face.png",
            "pads": "0 10 0 0",
            "audio": audio_url,
            "smooth": True,
            "resize_factor": 1
        }
    )
    return video_url
