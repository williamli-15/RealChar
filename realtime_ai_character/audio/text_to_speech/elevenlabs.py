import asyncio
import os
import time
import types
import uuid

import httpx

from realtime_ai_character.logger import get_logger
from realtime_ai_character.utils import Singleton, timed
from realtime_ai_character.audio.text_to_speech.base import TextToSpeech
from realtime_ai_character.video.replicate import generate_video
from realtime_ai_character.cloud.google_storage import upload_blob

logger = get_logger(__name__)

DEBUG = False

ELEVEN_LABS_MULTILINGUAL_MODEL = 'eleven_multilingual_v2' if os.getenv(
    "ELEVEN_LABS_USE_V2",
    'false').lower() in ('true', '1') else 'eleven_multilingual_v1'

config = types.SimpleNamespace(**{
    'chunk_size': 1024,
    'url': 'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream',
    'headers': {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': os.environ['ELEVEN_LABS_API_KEY']
    },
    'data': {
        'model_id': 'eleven_monolingual_v1',
        'voice_settings': {
            'stability': 0.5,
            'similarity_boost': 0.75
        }
    }
})


AUDIO_TEMP_DIR = os.getenv('AUDIO_TEMP_DIR', 'audio_temp')

if not os.path.exists(AUDIO_TEMP_DIR):
    os.makedirs(AUDIO_TEMP_DIR)


class ElevenLabs(Singleton, TextToSpeech):
    def __init__(self):
        super().__init__()
        logger.info("Initializing [ElevenLabs Text To Speech] voices...")

    @timed
    async def stream(self, text, websocket, tts_event: asyncio.Event,
                     voice_id="21m00Tcm4TlvDq8ikWAM",
                     first_sentence=False, language='en-US', video_template=None, greeting_video=None) -> None:
        if DEBUG:
            return
        if voice_id == "":
            logger.info("voice_id is not found in .env file, using ElevenLabs default voice")
            voice_id = "21m00Tcm4TlvDq8ikWAM"
        if first_sentence and greeting_video:
            await websocket.send_bytes(greeting_video)
            return

        headers = config.headers
        if language != 'en-US':
            config.data["model_id"] = 'eleven_multilingual_v1'
        data = {
            "text": text,
            **config.data,
        }
        url = config.url.format(voice_id=voice_id)
        if first_sentence:
            url = url + '?optimize_streaming_latency=4'
        loop = asyncio.get_event_loop()
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
            if response.status_code != 200:
                logger.error(
                    f"ElevenLabs returns response {response.status_code}")
            # original audio code
            # async for chunk in response.aiter_bytes():
            #     await asyncio.sleep(0.1)
            #     if tts_event.is_set():
            #         # stop streaming audio
            #         break
            #     await websocket.send_bytes(chunk)
            print('generated audio url: ', url)
            uuid_file_name = str(uuid.uuid4())
            file_path = os.path.join(AUDIO_TEMP_DIR, uuid_file_name)
            with open(file_path, 'wb') as f:
                f.write(response.content)
            audio_url = await loop.run_in_executor(
                None,
                upload_blob,
                file_path,
                uuid_file_name
            )
            print('upload audio url: ', audio_url)
            os.remove(file_path)
            video_url = await loop.run_in_executor(
                None,
                generate_video,
                video_template,
                audio_url
            )
            print('generated video url: ', video_url)
            await websocket.send_bytes(video_url)

    async def generate_audio(self, text, voice_id = "", language='en-US') -> bytes:
        if DEBUG:
            return
        if voice_id == "":
            logger.info("voice_id is not found in .env file, using ElevenLabs default voice")
            voice_id = "21m00Tcm4TlvDq8ikWAM"
        headers = config.headers
        if language != 'en-US':
            config.data["model_id"] = ELEVEN_LABS_MULTILINGUAL_MODEL
        data = {
            "text": text,
            **config.data,
        }
        # Change to non-streaming endpoint
        url = config.url.format(voice_id=voice_id).replace('/stream', '')
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
            if response.status_code != 200:
                logger.error(f"ElevenLabs returns response {response.status_code}")
            # Get audio/mpeg from the response and return it
            return response.content
