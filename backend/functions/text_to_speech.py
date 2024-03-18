import requests
from decouple import config
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

def convert_text_to_speech(message: str, voice_id: str):
    logging.debug(f"Using voice_id: {voice_id}")
    logging.debug(f"Message: {message}")

    body = {
        "text": message,
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0,
        }
    }

    headers = {
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "Content-Type": "application/json",
        "accept": "audio/mpeg"
    }
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    try:
        response = requests.post(endpoint, json=body, headers=headers)
        logging.debug(f"Request URL: {response.url}")
        logging.debug(f"Request Headers: {response.request.headers}")
        logging.debug(f"Request Body: {response.request.body}")

        if response.status_code == 200:
            return response.content
        else:
            logging.error(f"Failed to convert text to speech with status code: {response.status_code}")
            logging.debug(f"Response: {response.text}")
            return None
    except Exception as e:
        logging.exception("Exception occurred during text-to-speech conversion")
        return None
