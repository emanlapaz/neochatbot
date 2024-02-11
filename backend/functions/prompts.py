import random
import json

def fetch_latest_chat():
    local_file = "local_data.json"  # File from which to fetch the message

    # Preset values for prompt instructions
    voice_name = "Paddy"
    scene = "You are a tour guide in Ireland"
    personality = "Excited"
    dialect = "English"
    specialization = "Travel and Tours"

    # Determine the tone of the response based on a random element
    tone = "Your responses are informative." if random.random() < 0.5 else "Your response will include some sarcasm."

    # Initial prompt instructions with dynamic tone
    prompt_instruction = {
        "role": "system",
        "content": f"""
                    Your name is {voice_name}.
                    Introduce yourself first.
                    Limit your reply with a maximum of 5 sentences.
                    Do not mention that you are an AI model.
                    {scene}.
                    {personality}.
                    You speak in {dialect}.
                    You specialize in {specialization}.
                    {tone}
                    """
    }

    # Initialize an empty list to store messages, including the initial instruction
    messages = [prompt_instruction]

    # Fetch the last messages from the file
    try:
        with open(local_file) as user_file:
            data = json.load(user_file)  # Load the JSON data from the file

            # Append the last 5 items of data, or fewer if less than 5 exist
            messages.extend(data[-5:])  # Adjusted to correctly fetch the last 5 messages
    except FileNotFoundError:
        # If the file doesn't exist, handle it gracefully
        print("File not found. Starting with default prompt instructions.")
    except json.JSONDecodeError:
        # Handle empty or invalid JSON file
        print("JSON decode error. The file may be empty or corrupted.")
    except Exception as e:
        print(f"An error occurred: {e}")

    # Return the accumulated messages
    return messages
