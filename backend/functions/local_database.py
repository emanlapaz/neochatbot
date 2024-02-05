import json
from functions.prompts import fetch_latest_chat

#store Messages
def save_chat(request_message, response_message):
    
    #define file name
    local_file = "local_data.json"

    #get recent messages
    messages = fetch_latest_chat()[1:]

    #add messages to data
    user_message = {"role": "user", "content": request_message }
    assistant_message = {"role": "assistant", "content": response_message}
    messages.append(user_message)
    messages.append(assistant_message)

    #save the updated file
    with open(local_file, "w") as f:
        json.dump(messages, f)

    #reset messages
def reset_chat_history():

    #overwrite curent file with blank file
    open("local_data.json", "w")




    