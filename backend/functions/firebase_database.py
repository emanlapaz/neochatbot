import datetime
from firebase_admin import db

def save_chat(user_id: str, request_message: str, response_message: str):

    ref = db.reference(f'users/{user_id}/chats').push()
    ref.set({
        'user_message': request_message,
        'assistant_message': response_message,
        'timestamp': datetime.datetime.now().isoformat(),
    })



def reset_chat_history(user_id: str):
    # Reference to the specific user's chats
    user_chats_ref = db.reference(f'users/{user_id}/chats')
    
    # Delete the user's chats
    user_chats_ref.delete()