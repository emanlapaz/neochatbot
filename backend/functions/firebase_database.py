import datetime
from firebase_admin import db

#saves the caht mesage between user and the chatbot
def save_chat(user_id: str, request_message: str, response_message: str, chatbot_id: str):
    
    #reference to chat node for the user and chatbot
    ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}/chats').push()
    
    #sets the chat message details, added the timestamp
    ref.set({
        'user_message': request_message,
        'assistant_message': response_message,
        'timestamp': datetime.datetime.now().isoformat(),
    })

#resets the chat history
def reset_chat_history(user_id: str, chatbot_id: str):

    chatbot_chats_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}/chats')
    
    #deletes the chat history node
    chatbot_chats_ref.delete()
