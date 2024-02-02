import {useState} from 'react';
import axios from 'axios';

type Props = {
    setMessages: any;
};

function Title({setMessages}: Props) {
    const [isResetting, setIsResetting]= useState(false);

    //Reset the conversation
    const resetConversation =async () => {
        setIsResetting(true);

        //reset end point on backend
        await axios.get("http://localhost:8000/reset")
        .then((res) => {
        if (res.status == 200) {
            setMessages([]) //set messages to empty list when successful
        } else {
            console.error("Error on API request backend reset");
        }
    }).catch((err) => {
        console.error(err.message);
    });
        setIsResetting(false);
    };

    //add reset button on title
  return (
  <div>NeoCHatBot
    <button onClick={resetConversation} className="bg-blue-500">Reset</button>
  </div>
  
  );
}


export default Title