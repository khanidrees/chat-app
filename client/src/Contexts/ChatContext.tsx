import { createContext, useContext, useEffect, useState } from "react";

export const ChatContext = createContext(undefined);

export const ChatProvider = ({children})=>{
    const [currChat, setCurrChat] = useState();
     
  useEffect(() => {
    
    localStorage.setItem('currChat', currChat); 
  }, [currChat]);

  function updateChat(value){
    setCurrChat(value);
  }
    return <ChatContext.Provider value={{currChat, updateChat}}>
    {children}
    </ChatContext.Provider>
}

export const useChat = () =>{
  return useContext(ChatContext);
}