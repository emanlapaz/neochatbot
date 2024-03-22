import openai
from decouple import config

from functions.prompts import fetch_latest_chat

#openAI credentials
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")

#Fetche s the latest chat message for the user
def get_chat_response(message_input, user_id, chatbot_id):
    
    fetched_messages = fetch_latest_chat(user_id, chatbot_id)

    #iterates through the chat messages based on the user/assistant roles and appends it to the lost
    messages = []
    for msg in fetched_messages:
        if 'role' in msg and msg['role'] == 'system':
            messages.append(msg)
        else:
            if 'user_message' in msg:
                messages.append({"role": "user", "content": msg['user_message']})
            if 'assistant_message' in msg:
                messages.append({"role": "assistant", "content": msg['assistant_message']})


    user_message = {"role": "user", "content": message_input}
    messages.append(user_message)

    # Customize behavior based on chatbotId
    model = "gpt-3.5-turbo"  # Default model

    try:
        #send messages to openAi APi for response
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages
        )
        message_text = response.choices[0].message.content
        return message_text
    except Exception as e:
        print(e)
        return


def convert_audio_to_text(audio_file):
  try:
    #transcribe audio using openAI whisper
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    message_text = transcript["text"]
    return message_text
  except Exception as e:
    return