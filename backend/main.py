from fastapi import FastAPI, HTTPException, Depends  # Add Depends here
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth, db
from typing import List, Optional


# Custom Function Imports
from functions.firebase_database import save_chat, reset_chat_history
from functions.openai_requests import get_chat_response
from functions.firebase_authorization import get_current_user

cred = credentials.Certificate("C:\\Users\\eugen\\neochatbot\\backend\\neo-chatbot-e6c8c-firebase-adminsdk-mnv0s-cccccdc3f9.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://neo-chatbot-e6c8c-default-rtdb.europe-west1.firebasedatabase.app/'
})


# Define Pydantic model for incoming text messages
class TextMessage(BaseModel):
    text: str

class UserSignupModel(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    interests: List[str] = []  # List of interests

class CustomizationDetails(BaseModel):
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
async def reset_conversation():
    reset_chat_history()
    return {"message": "Chat History reset"}

# Post text and get response
@app.post("/post-text/")
async def post_text(message: TextMessage, user_id: str = Depends(get_current_user)):
    text = message.text

    # Pass user_id to get_chat_response
    chat_response = get_chat_response(text, user_id)
    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed to get chat response")
    
    # Save messages with the user ID
    save_chat(user_id, text, chat_response)

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


@app.post("/customize-chat/")
async def customize_chat(customizations: CustomizationDetails):
    try:
      
        user_id = customizations.user_id

    
        customizations_dict = customizations.dict()

    
        del customizations_dict['user_id']

        db.reference(f'users/{user_id}/customizations').set(customizations_dict)

        return {"status": "Customization saved", "customizations": customizations_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save customizations: {str(e)}")
