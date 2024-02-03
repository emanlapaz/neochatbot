import json
from functions.prompts import fetch_latest_messages 

#store Messages
def save_messages(request_message, response_message):
    
    #define file name
    file_name = "local_data.json"

    #get recent messages
    messages = fetch_latest_messages()[1:]

    #add messages to data
    user_message = {"role": "user", "content": request_message }
    assistant_message = {"role": "assistant", "content": response_message}
    messages.append(user_message)
    messages.append(assistant_message)

    #save the updated file
    with open(file_name, "w") as f:
        json.dump(messages, f)

    #reset messages
def reset_chat_history():

    #overwrite curent file with blank file
    open("local_data.json", "w")




    