#1 =    virtEnv\Scripts\activate-- go to virtual env
#2 =    uvicorn main:app --reload (load like react)

#main imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai

#Custom Function Imports
#
#...

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

# post chatbot response; not playing in browser whebn using post request
# @app.post("/post-audio/")
# async def post_audio(file: UploadFile = File(...)):
#     print("hello")
