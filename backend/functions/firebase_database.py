import datetime
from firebase_admin import db

def save_chat(user_id: str, request_message: str, response_message: str, chatbot_id: str):
    # Adjust the reference path to include the chatbot_id, organizing chats under their respective chatbot
    ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}/chats').push()
    ref.set({
        'user_message': request_message,
        'assistant_message': response_message,
        'timestamp': datetime.datetime.now().isoformat(),
    })


def reset_chat_history(user_id: str, chatbot_id: str):
    # Reference to the specific chatbot's chats under the user's profile
    chatbot_chats_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}/chats')
    
    # Delete the chatbot's chats
    chatbot_chats_ref.delete()
