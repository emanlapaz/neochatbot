from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth, db
from typing import List, Optional
from fastapi.responses import JSONResponse


# Custom Function Imports
from functions.firebase_database import save_chat, reset_chat_history
from functions.openai_requests import get_chat_response
from functions.firebase_authorization import get_current_user

cred = credentials.Certificate("C:\\Users\\eugen\\neochatbot\\backend\\neo-chatbot-e6c8c-firebase-adminsdk-mnv0s-cccccdc3f9.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://neo-chatbot-e6c8c-default-rtdb.europe-west1.firebasedatabase.app/'
})


class TextMessage(BaseModel):
    text: str
    chatbotId: str  # Add the chatbotId field

class UserSignupModel(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    interests: List[str] = []  # List of interests

class ChatbotDetails(BaseModel):
    user_id: str
    bot_name: str
    scene: str
    personality: str
    language: str
    specialization: str
    voice_enabled: bool = False
    voice_name: Optional[str] = None

# Initiate app
app = FastAPI()

# CORS Origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000",
]

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check health
@app.get("/health")
async def check_health():
    return {"message": "NeoChatBot! is Healthy"}

# Reset messages

@app.get("/reset")
async def reset_conversation(user_id: str = Depends(get_current_user), chatbot_id: str = Query(None)):
    # Check if chatbot_id is provided
    if chatbot_id is None:
        # If no chatbot_id is provided, you might want to reset all chats for the user
        # or handle the request differently based on your application's requirements.
        raise HTTPException(status_code=400, detail="Chatbot ID is required for resetting chat history.")
    else:
        # Reset chat history for the specified chatbot
        reset_chat_history(user_id, chatbot_id)
        return {"message": f"Chat history for chatbot {chatbot_id} has been reset."}


@app.get("/get-bot-name/{chatbot_id}")

async def get_bot_name(chatbot_id: str, user_id: str = Depends(get_current_user)):
    try:
        chatbot_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}')

        chatbot_details = chatbot_ref.get()

        bot_name = chatbot_details.get("bot_name") if chatbot_details else "Neo"

        return JSONResponse(content={"bot_name": bot_name})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bot name: {str(e)}")

# Post text and get response
@app.post("/post-text/")
async def post_text(message: TextMessage, user_id: str = Depends(get_current_user)):
    text = message.text
    chatbot_id = message.chatbotId  # Extract the chatbotId from the request

    # Use the chatbot_id along with the text to get a response.
    # This function needs to be implemented based on your application's logic.
    chat_response = get_chat_response(text, user_id, chatbot_id)
    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed to get chat response")
    
    # Assuming save_chat can handle chatbot_id if needed
    save_chat(user_id, text, chat_response, chatbot_id)

    return {"user_message": text, "bot_response": chat_response}



# User Signup
@app.post("/signup/")
async def signup(user_details: UserSignupModel):
    try:
        user_record = auth.create_user(
            email=user_details.email,
            password=user_details.password,
            display_name=user_details.username
        )

        db.reference(f'users/{user_record.uid}').set({
            'username': user_details.username,
            'first_name': user_details.first_name,
            'last_name': user_details.last_name,
            'interests': user_details.interests,

        })
        return {"uid": user_record.uid, "email": user_record.email}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/create-chatbot/")
async def create_chatbot(chatbots: ChatbotDetails, user_id: str = Depends(get_current_user)):
    try:
        chatbots_dict = chatbots.dict(exclude={'user_id'})
        
        new_chatbot_ref = db.reference(f'users/{user_id}/chatbots').push(chatbots_dict)
        
        chatbot_id = new_chatbot_ref.key

        return {"status": "Customization saved", "chatbot_id": chatbot_id, "chatbots": chatbots_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save chatbot: {str(e)}")

@app.post("/load-chatbot/")
async def load_chatbot(data: dict, user_id: str = Depends(get_current_user)):
    chatbot_id = data.get("chatbot_id")
    if not chatbot_id:
        raise HTTPException(status_code=400, detail="Chatbot ID is required")
    
    try:
        chatbot_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}')
        chatbot_details = chatbot_ref.get()
        if not chatbot_details:
            raise HTTPException(status_code=404, detail="Chatbot not found")
        return chatbot_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load chatbot: {str(e)}")
