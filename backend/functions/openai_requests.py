import openai
from decouple import config

#retrieve ENV
openai.organization=config("OPEN_AI_ORG")
openai.api_key= config("OPEN_AI_KEY")



# Open Ai - Whisper
#convert audio to text

def convert_audio_to_text(audio_file):
    try:
        transcipt = openai.Audio.transcribe("whisper-1", audio_file)
        message_text = transcipt["text"]
        return message_text
    except Exception as e:
        print(e)
        return
