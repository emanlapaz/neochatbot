import openai
from decouple import config

from functions.prompts import fetch_latest_chat

openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")

def get_chat_response(message_input, user_id, chatbot_id):
    #Latest chat messages for the user
    fetched_messages = fetch_latest_chat(user_id, chatbot_id)

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
    if chatbot_id == "some_specific_chatbot_id":
        model = "text-davinci-003" 

    try:
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
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    message_text = transcript["text"]
    return message_text
  except Exception as e:
    return