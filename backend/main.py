#1 =    virtEnv\Scripts\activate-- go to virtual env
#2 =    uvicorn main:app --reload (load like react)

#main imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai

#Custom Function Imports
from functions.local_database import save_messages, reset_chat_history
from functions.openai_requests import convert_audio_to_text, get_chat_response
from functions.text_to_speech import convert_text_to_speech

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


#reset messages
@app.get("/reset")
async def reset_conversation():
    reset_chat_history()
    return {"message": "conversation reset"}


# #get audio
# @app.get("/post-audio-get/")
# async def get_audio():

#get audio
@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):

    #get saved audio
    #audio_input = open("voice.mp3", "rb") #r = read rb = read bytes

    #save file from front end
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb") #r = read rb = read bytes

    #decode audio
    message_decoded = convert_audio_to_text(audio_input)

    #Guard: ensure message decoded
    if not message_decoded:
        return HTTPException(status_code=400, detail="Failed to decode audio")

    #get cgpt response
    chat_response = get_chat_response(message_decoded)


    #Guard: ensure message decoded
    if not chat_response:
        return HTTPException(status_code=400, detail="Failed to get chat response")
    
    #Store messages
    save_messages(message_decoded, chat_response)

    #convert chat response to audio
    print(chat_response)
    audio_output = convert_text_to_speech(chat_response)

    #Guard: ensure message decoded
    if not audio_output:
        return HTTPException(status_code=400, detail="Failed to get Eleven Labs audio response")
    
    #create a generator that yields chunck of data
    def iterfile():
        yield audio_output

    #return audio file
    #return StreamingResponse(iterfile(), media_type="audio/mpeg")    
    return StreamingResponse(iterfile(), media_type="application/octet-stream")