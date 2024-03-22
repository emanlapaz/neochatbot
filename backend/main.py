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
import os
import json

#needed to specify path for backend deployment
project_root = Path(__file__).parent #get parent directory
functions_path = project_root / 'functions' #define path function
sys.path.append(str(functions_path)) #add functions directory to system path

from functions.firebase_database import save_chat, reset_chat_history
from functions.openai_requests import get_chat_response, convert_audio_to_text
from functions.firebase_authorization import get_current_user
from functions.text_to_speech import convert_text_to_speech

from dotenv import load_dotenv
load_dotenv()  #loads the environment variables from .env

firebase_credentials_raw = os.getenv("FIREBASE_CREDENTIALS")
firebase_credentials = json.loads(firebase_credentials_raw)

cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://neo-chatbot-e6c8c-default-rtdb.europe-west1.firebasedatabase.app/'
})

#Pydantic models to define structure of data
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

#fastAPI app instance
app = FastAPI()

#allowed list fo CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000",
    "https://neochatbot.onrender.com", #deployed site
]
 #allowsclient-side web apss to interact with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#health check
@app.get("/health")
async def check_health():
    return {"message": "NeoChatBot! is Healthy"}

#reset messages
@app.get("/reset")
async def reset_conversation(user_id: str = Depends(get_current_user), chatbot_id: str = Query(None)):

    if chatbot_id is None:
        raise HTTPException(status_code=400, detail="Chatbot ID is required for resetting chat history.")
    else:
        # Reset chat for the specified chatbot
        reset_chat_history(user_id, chatbot_id)
        return {"message": f"Chat history for chatbot {chatbot_id} has been reset."}

#retrieves the bot name and display it in the frontend
@app.get("/get-bot-name/{chatbot_id}")

async def get_bot_name(chatbot_id: str, user_id: str = Depends(get_current_user)):
    try:
        chatbot_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}')

        chatbot_details = chatbot_ref.get()

        bot_name = chatbot_details.get("bot_name") if chatbot_details else "Neo"

        return JSONResponse(content={"bot_name": bot_name})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bot name: {str(e)}")

#post text and get response
@app.post("/post-text/")
async def post_text(message: TextMessage, user_id: str = Depends(get_current_user)):
    text = message.text
    chatbot_id = message.chatbotId  # Extract the chatbotId from the request

    chat_response = get_chat_response(text, user_id, chatbot_id)
    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed to get chat response")
    
    save_chat(user_id, text, chat_response, chatbot_id)

    return {"user_message": text, "bot_response": chat_response}

#user Signup
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

#create chatbot for the current user
@app.post("/create-chatbot/")
async def create_chatbot(chatbots: ChatbotDetails, user_id: str = Depends(get_current_user)):
    try:
        #converts Pydantic model to dict and exclude user id
        chatbots_dict = chatbots.dict(exclude={'user_id'})
        
        #adds the new chatbot
        new_chatbot_ref = db.reference(f'users/{user_id}/chatbots').push(chatbots_dict)
        
        #gets the unique ID
        chatbot_id = new_chatbot_ref.key
        
        return {"status": "Customization saved", "chatbot_id": chatbot_id, "chatbots": chatbots_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save chatbot: {str(e)}")

#loads te chatbot details based on the user
@app.post("/load-chatbot/")
async def load_chatbot(data: dict, user_id: str = Depends(get_current_user)):
    chatbot_id = data.get("chatbot_id")
    if not chatbot_id:
        raise HTTPException(status_code=400, detail="Chatbot ID is required")
    
    try:
        #retrieves chatbot details from db
        chatbot_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}')

        chatbot_details = chatbot_ref.get()

        if not chatbot_details:
            raise HTTPException(status_code=404, detail="Chatbot not found")

        return chatbot_details
    #catch errors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load chatbot: {str(e)}")

#deletes a chatbot based on the current user
@app.delete("/delete-chatbot/{chatbot_id}")
async def delete_chatbot(chatbot_id: str, user_id: str = Depends(get_current_user)):
    try:
        #reference chatbot in db and check if it exists
        chatbot_ref = db.reference(f'users/{user_id}/chatbots/{chatbot_id}')

        #returns 404 if chatbot not found
        if not chatbot_ref.get():
            return JSONResponse(status_code=404, content={"message": "Chatbot not found"})
        
        #delete from db
        chatbot_ref.delete()

        return {"message": f"Chatbot {chatbot_id} successfully deleted."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete chatbot: {str(e)}")

#convert audio file to text
@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):

    #save audio file temporarily
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")

    #decode audio file to text
    message_decoded = convert_audio_to_text(audio_input)

    if not message_decoded:
        raise HTTPException(status_code=400, detail="Failed to decode audio file")
    
    return {"message": message_decoded}

#convert text to speech and return as a stream
@app.post("/convert-text-to-speech/")
async def text_to_speech_endpoint(request: TextToSpeechRequest):

    #convert text to speech
    audio_output = convert_text_to_speech(request.text, request.voice_id)
    
    if not audio_output:
        raise HTTPException(status_code=400, detail="Failed audio output")
    
    #define a generator function to yield the audio output
    def iterfile():
        yield audio_output

    #return audio output as streaming response, users can receive immediate feedback/ faster response
    return StreamingResponse(iterfile(), media_type="application/octet-stream")