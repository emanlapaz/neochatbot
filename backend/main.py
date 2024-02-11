from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Custom Function Imports
from functions.local_database import save_chat, reset_chat_history
from functions.openai_requests import get_chat_response

# Define Pydantic model for incoming text messages
class TextMessage(BaseModel):
    text: str

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
async def post_text(message: TextMessage):
    # Extract text from the request body
    text = message.text

    # Get GPT response
    chat_response = get_chat_response(text)

    # Guard: ensure there is a response
    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed to get chat response")
    
    # Store messages
    save_chat(text, chat_response)

    # Return text response
    return {"user_message": text, "bot_response": chat_response}
