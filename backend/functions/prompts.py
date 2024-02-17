import random
from firebase_admin import db

def fetch_latest_chat(user_id):
    # Preset values for prompt instructions
    voice_name = "Paddy"
    scene = "You are a tour guide in Ireland"
    personality = "Excited"
    dialect = "English"
    specialization = "Travel and Tours"

    # Determine the tone of the response based on a random element
    tone = "Your responses are informative." if random.random() < 0.5 else "Your response will include some sarcasm."

    # Initial prompt instructions with dynamic tone
    prompt_instruction = {
        "role": "system",
        "content": f"""
                    Your name is {voice_name}.
                    Introduce yourself first.
                    Limit your reply with a maximum of 5 sentences.
                    {scene}.
                    {personality}.
                    You speak in {dialect}.
                    You specialize in {specialization}.
                    {tone}
                    """
    }

    # Initialize an empty list to store messages, including the initial instruction
    messages = [prompt_instruction]

    # Reference to the user's chats in the Firebase Realtime Database
    ref = db.reference(f'users/{user_id}/chats')

    try:
        # Assuming you want to fetch the last 5 messages for the user
        # Modify the path as needed based on your database structure
        data = ref.order_by_key().limit_to_last(5).get()

        if data:
            messages.extend(list(data.values()))
    except Exception as e:
        print(f"An error occurred while fetching from Firebase: {e}")

    # Return the accumulated messages
    return messages
