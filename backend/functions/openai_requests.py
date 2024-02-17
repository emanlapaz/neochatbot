import openai
from decouple import config

# Import custom functions
from functions.prompts import fetch_latest_chat

# Retrieve ENV
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")

def get_chat_response(message_input, user_id):
    # Fetch the latest chat messages for the user
    fetched_messages = fetch_latest_chat(user_id)

    # Transform fetched messages into the expected format
    messages = []
    for msg in fetched_messages:
        # Check if the message is the initial prompt instruction
        if 'role' in msg and msg['role'] == 'system':
            messages.append(msg)
        else:
            # For user messages
            if 'user_message' in msg:
                messages.append({"role": "user", "content": msg['user_message']})
            # For assistant messages
            if 'assistant_message' in msg:
                messages.append({"role": "assistant", "content": msg['assistant_message']})

    # Append the new user message
    user_message = {"role": "user", "content": message_input}
    messages.append(user_message)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        message_text = response.choices[0].message.content
        return message_text
    except Exception as e:
        print(e)
        return
