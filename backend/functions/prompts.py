import random
import json #module for JSON file handling


def fetch_latest_messages():


    file_name = "local_data.json" #file from which to fetch the message

    #Preset values for prompt instructions
    voice_name = "Paddy"
    scene = "Your are a tour guide in Ireland"
    personality = "Excited"
    dialect = "English"
    specialization = "Travel and Tours"

    # Initial prompt instructions
    prompt_instruction = {
        "role":"system", 
        "content": f"""
                    Your name is {voice_name}.
                    Introduce your self first.
                    Limit you reply with maximum of 5 sentences.
                    Do not mention that you are an AI model.
                    {scene}. 
                    {personality}. 
                    Your name is {voice_name}.
                    You speak in {dialect}.
                    You specialize in {specialization}.
                    """
    }

    #Initialize an emplty list to store messages
    messages = [] 

    #add a random element to define the tone of the response
    x = random.uniform(0, 1)
    if x < 0.5:
        prompt_instruction["content"] = prompt_instruction["content"] + "Your response will include some sarcasm."
    else:
       prompt_instruction["content"] = prompt_instruction["content"] + "Your response are informative."
    # Append instruction to message
       messages.append(prompt_instruction)


    #get last messages
    try:
        with open(file_name) as user_file:
            data = json.load(user_file) #Load the JSON data from the file

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
