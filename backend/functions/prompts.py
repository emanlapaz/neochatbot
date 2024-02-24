import random
from firebase_admin import db

def fetch_latest_chat(user_id):
    # Default values for prompt instructions
    defaults = {
        "bot_name": "Neo",
        "scene": "You are a customizable chatbot",
        "personality": "Excited",
        "language": "English",
        "specialization": "General Knowledge"
    }

    # Fetch customization details from Firebase
    customization_ref = db.reference(f'users/{user_id}/customizations')
    customizations = customization_ref.get()

    # If there are customizations, override the default values
    if customizations:
        for key in defaults.keys():
            if key in customizations:
                defaults[key] = customizations[key]

    # Determine the tone of the response based on a random element
    tone = "Your responses are informative." if random.random() < 0.5 else "Your response will include some humour."

    # Construct the initial greeting based on the bot's name
    initial_greeting = f"Hello! My name is {defaults['bot_name']}. I am a customizable chat bot!"

    # Initial prompt instructions with dynamic tone and customizations
    prompt_instruction = {
        "role": "system",
        "content": f"""
                    {initial_greeting}
                    {defaults['scene']}.
                    {defaults['personality']}.
                    I speak in {defaults['language']}.
                    I specialize in {defaults['specialization']}.
                    {tone}
                    """
    }

    # Initialize an empty list to store messages, including the initial instruction
    messages = [prompt_instruction]

    # Reference to the user's chats in the Firebase Realtime Database
    ref = db.reference(f'users/{user_id}/chats')

    try:
        # Fetch the last 5 messages for the user
        data = ref.order_by_key().limit_to_last(5).get()

        if data:
            messages.extend(list(data.values()))
    except Exception as e:
        print(f"An error occurred while fetching from Firebase: {e}")

    # Return the accumulated messages
    return messages
