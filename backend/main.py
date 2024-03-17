from fastapi import FastAPI, HTTPException, Depends, Query, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth, db
from typing import List, Optional
from fastapi.responses import JSONResponse, StreamingResponse
import requests
from pathlib import Path
import sys

project_root = Path(__file__).parent
functions_path = project_root / 'functions'
sys.path.append(str(functions_path))

from functions.firebase_database import save_chat, reset_chat_history
from functions.openai_requests import get_chat_response, convert_audio_to_text
from functions.firebase_authorization import get_current_user
from functions.text_to_speech import convert_text_to_speech

cred = credentials.Certificate("C:\\Users\\eugen\\neochatbot\\backend\\neo-chatbot-e6c8c-firebase-adminsdk-mnv0s-cccccdc3f9.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://neo-chatbot-e6c8c-default-rtdb.europe-west1.firebasedatabase.app/'
})


class TextMessage(BaseModel):
    text: str
    chatbotId: str

class UserSignupModel(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    interests: List[str] = []

class ChatbotDetails(BaseModel):
    user_id: str
    bot_name: str
    scene: str
    personality: str
    language: str
    specialization: str
    voice_enabled: bool = False
    voice_name: Optional[str] = None
    voice_id: Optional[str] = None


class TextToSpeechRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None

app = FastAPI()

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000",
]

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

#Reset messages
@app.get("/reset")
async def reset_conversation(user_id: str = Depends(get_current_user), chatbot_id: str = Query(None)):

    if chatbot_id is None:
        raise HTTPException(status_code=400, detail="Chatbot ID is required for resetting chat history.")
    else:
        # Reset chat for the specified chatbot
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

#Post text and get response
@app.post("/post-text/")
async def post_text(message: TextMessage, user_id: str = Depends(get_current_user)):
    text = message.text
    chatbot_id = message.chatbotId  # Extract the chatbotId from the request

    chat_response = get_chat_response(text, user_id, chatbot_id)
    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed to get chat response")
    
    save_chat(user_id, text, chat_response, chatbot_id)

    return {"user_message": text, "bot_response": chat_response}



#User Signup
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

        if "voice_id" in chatbot_details:
            print(f"Voice ID: {chatbot_details['voice_id']} found for chatbot: {chatbot_id}")
        else:
            print(f"No Voice ID found for chatbot: {chatbot_id}")

        return chatbot_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load chatbot: {str(e)}")
    
@app.delete("/delete-chatbot/{chatbot_id}")
async def delete_chatbot(chatbot_id: str, user_id: str = Depends(get_current_user)):
    try:
        chatbot_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}')

        if not chatbot_ref.get():
            return JSONResponse(status_code=404, content={"message": "Chatbot not found"})
        
        chatbot_ref.delete()
        
        return {"message": f"Chatbot {chatbot_id} successfully deleted."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete chatbot: {str(e)}")

#Convert audio to text
@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):

    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")

    # Decode audio
    message_decoded = convert_audio_to_text(audio_input)

    print(message_decoded)

    if not message_decoded:
        raise HTTPException(status_code=400, detail="Failed to decode audio")
    
    return {"message": message_decoded}


@app.post("/convert-text-to-speech/")
async def text_to_speech_endpoint(request: TextToSpeechRequest):
    audio_output = convert_text_to_speech(request.text, request.voice_id)
    
    if not audio_output:
        raise HTTPException(status_code=400, detail="Failed audio output")
    
    def iterfile():
        yield audio_output

    return StreamingResponse(iterfile(), media_type="application/octet-stream")