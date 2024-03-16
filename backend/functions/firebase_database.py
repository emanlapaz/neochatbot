import datetime
from firebase_admin import db

def save_chat(user_id: str, request_message: str, response_message: str, chatbot_id: str):
    ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}/chats').push()
    ref.set({
        'user_message': request_message,
        'assistant_message': response_message,
        'timestamp': datetime.datetime.now().isoformat(),
    })


def reset_chat_history(user_id: str, chatbot_id: str):

    chatbot_chats_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}/chats')
    
    #Delete all chats
    chatbot_chats_ref.delete()
