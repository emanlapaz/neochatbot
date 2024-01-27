#1 =    virtEnv\Scripts\activate-- go to virtual env
#2 =    uvicorn main:app --reload (load like react)

#main imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai

#Custom Function Imports
from functions.openai_requests import convert_audio_to_text

#initiate app
app = FastAPI()

# CORS -Origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000",
]

# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#check health
@app.get("/health")
async def check_health():
    return {"message": "NeoChatBot! Healthy"}

#get audio
@app.get("/post-audio-get/")
async def get_audio():

    #get saved audio
    audio_input = open("voice.mp3", "rb") #r = read rb = read bytes

    #decode audio
    message_decoded = convert_audio_to_text(audio_input)

    print (message_decoded)

    return "Done"


    
# post chatbot response; not playing in browser whebn using post request
# @app.post("/post-audio/")
# async def post_audio(file: UploadFile = File(...)):
#     print("hello")
