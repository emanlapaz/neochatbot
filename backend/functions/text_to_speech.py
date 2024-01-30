import requests

from decouple import config

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

#eleven labs convert text to speech
def convert_text_to_speech(message):

#define body (data)
    body = {
        "text": message,
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0,
        }
    }

#voice id 
    #voice_id = "D38z5RcWu1voky8WS1ja" - # fin- irish
    #voice_id = "Yko7PKHZNXotIFUBG7I9" #Mathhew brit
    #bVMeCyTHy58xNoL34h3p - jeremy american irish young

    voice_id = "bVMeCyTHy58xNoL34h3p"


#constructing headers/endpoint
    headers = {"xi-api-key": ELEVEN_LABS_API_KEY, "Content-Type": "application/json", "accept": "audio/mpeg"}
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

#send request
    try:
        response = requests.post(endpoint, json=body, headers=headers)
    except Exception as e:
        return
    
    #handle response
    if response.status_code == 200:
        return response.content
    else:
        return