import random
from firebase_admin import db

def fetch_latest_chat(user_id, chatbot_id):
    #default chat bot settings
    defaults = {
        "bot_name": "Neo",
        "scene": "You are a customizable chatbot",
        "personality": "Excited",
        "language": "English",
        "specialization": "General Knowledge"
    }

    #reference to the chatbots data in firebase
    chatbot_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}')

    #fetch the chatbot details from firebase
    chatbots = chatbot_ref.get()

    #if chatbot exists, updates the defaults with the actual settings
    if chatbots:
        for key in defaults.keys():
            if key in chatbots:
                defaults[key] = chatbots[key]

    #default tone, added a 50% chance that the response will include humour
    tone = "Your responses are informative." if random.random() < 0.5 else "Your response will include some humour."

    prompt_instruction = {
        "role": "system",
        "content": f"""
                    {defaults['scene']}.
                    {defaults['personality']}.
                    I speak in {defaults['language']}.
                    I specialize in {defaults['specialization']}.
                    {tone}
                    """
    }

    #initialize the list with prompt instruction
    messages = [prompt_instruction]

    #firebase reference
    ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}/chats')

    try:
        #retrieve last 5 conversations for continuity in chat
        data = ref.order_by_key().limit_to_last(5).get()

        if data:
            messages.extend(list(data.values()))
    #catch exceptions       
    except Exception as e:
        print(f"An error occurred while fetching from Firebase: {e}")

    return messages
