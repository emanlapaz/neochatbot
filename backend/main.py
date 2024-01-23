from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    print("Whatsapp!")
    return {"Hello World": "NeoChatBot! Online!!"}
