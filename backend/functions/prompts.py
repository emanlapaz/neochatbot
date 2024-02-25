import random
from firebase_admin import db

def fetch_latest_chat(user_id, chatbot_id):
    # Default values for prompt instructions
    defaults = {
        "bot_name": "Neo",
        "scene": "You are a customizable chatbot",
        "personality": "Excited",
        "language": "English",
        "specialization": "General Knowledge"
    }

    # Fetch chatbot details from Firebase for the specific chatbot
    chatbot_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}')
    chatbots = chatbot_ref.get()

    # If there are customizations, override the default values
    if chatbots:
        for key in defaults.keys():
            if key in chatbots:
                defaults[key] = chatbots[key]

    # Determine the tone of the response based on a random element
    tone = "Your responses are informative." if random.random() < 0.5 else "Your response will include some humour."

    # Construct the initial greeting based on the bot's name
    initial_greeting = f"Hello! My name is {defaults['bot_name']}. How can I help you today?"

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

    # Reference to the specific chatbot's chats in the Firebase Realtime Database
    ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}/chats')

    try:
        # Fetch the last 5 messages for the user and specific chatbot
        data = ref.order_by_key().limit_to_last(5).get()

        if data:
            messages.extend(list(data.values()))
    except Exception as e:
        print(f"An error occurred while fetching from Firebase: {e}")

    # Return the accumulated messages
    return messages
