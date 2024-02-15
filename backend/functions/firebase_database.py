import datetime
from firebase_admin import db

def save_chat(user_id: str, request_message: str, response_message: str):

    ref = db.reference(f'users/{user_id}/chats').push()
    ref.set({
        'user_message': request_message,
        'assistant_message': response_message,
        'timestamp': datetime.datetime.now().isoformat(),
    })



def reset_chat_history():

    ref = db.reference('chats')
    
    ref.delete()
