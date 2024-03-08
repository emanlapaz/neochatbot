import requests
from decouple import config

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

def convert_text_to_speech(message: str, voice_id: str):
    print(f"Using voice_id: {voice_id}")  # Debugging line to print the voice_id

    # Define body (data)
    body = {
        "text": message,
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0,
        }
    }

    # Constructing headers/endpoint
    headers = {
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "Content-Type": "application/json",
        "accept": "audio/mpeg"
    }
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    try:
        response = requests.post(endpoint, json=body, headers=headers)
        # Handle response
        if response.status_code == 200:
            return response.content
        else:
            print(f"Failed to convert text to speech with status code: {response.status_code}")
            if response.status_code != 200:
                print(f"Response body: {response.text}")  # Print error response body for debugging
            return None
    except Exception as e:
        print(f"Exception occurred: {e}")
        return None
