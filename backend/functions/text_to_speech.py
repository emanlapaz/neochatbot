import requests
from decouple import config
import logging

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

#API call to process text to speech by eleven labs
def convert_text_to_speech(message: str, voice_id: str):

    #sets the text to be converted to speech
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

        if response.status_code == 200:
            return response.content
        else:
            return None
    except Exception as e:
        logging.exception("Exception occurred during text-to-speech conversion")
        return None
