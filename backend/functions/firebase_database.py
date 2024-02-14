from firebase_admin import db

def save_chat(request_message, response_message):

    ref = db.reference('chats')
    
    new_chat_ref = ref.push()
    
    new_chat_ref.set({
        'user_message': request_message,
        'assistant_message': response_message
    })

def reset_chat_history():

    ref = db.reference('chats')
    
    ref.delete()
