import json
import random

#get recent messages

def get_recent_messages():

    #Define the file name and learn instruction
    file_name = "stored_data.json"
    learn_instruction = {
        "role":"system",
        "content": "Your are interviewing for a junior software engineer role. Ask questions relevant to the job and keep it short. Be at a grumpy mode. Your name is Killian. "
    }

    messages = []

    #add a randome element
    x = random.uniform(0, 1)
    if x < 0.5:
        learn_instruction["content"] = learn_instruction["content"] + "Your response will include some sarcastic humour."
    else:
       learn_instruction["content"] = learn_instruction["content"] + "Your response are somehow confusing."
    # Append instruction to message
       messages.append(learn_instruction)

    #get last messages
    try:
        with open(file_name) as user_file:
            data = json.load(user_file)

            #append last 5 items of data
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
    except Exception as e:
        print(e)
        pass

    #Return messages
    return messages

#store Messages
def store_messages():
    pass #to do
    