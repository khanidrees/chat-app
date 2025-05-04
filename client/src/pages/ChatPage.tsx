import { useParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Send, ChevronsDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { getChatMessages, postChatMessage } from "@/apis"
import { useAuth } from "@/Contexts/AuthContext"
import { socket } from "@/socket"

export default function ChatPage() {
  const { recieverId, chatId } = useParams<{ recieverId: string, chatId: string }>();
  const { loading, token, setToken,user,setUser } = useAuth();
  const [message, setMessage] = useState('');
  const [scrollBottom, setScrollBottom] = useState(false);
  // const [isScrollable, setIsScrollable] = useState(false);
  console.log(recieverId + " " + chatId);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  // Mock user data - in a real app, you would fetch this
  // const user = {
  //   id: recieverId,
  //   name: recieverId === "1" ? "John Doe" : recieverId === "2" ? "Jane Smith" : "User " + recieverId,
  //   avatar: "/placeholder.svg?height=40&width=40",
  // }
  function onMessageEvent(payload){
    const message = JSON.parse(payload);
    setMessages(prev =>([...prev, message]));
    // console.log(e);
  }
  function onConnectionEvent(){
    console.log('connected');
  }
  function onDisconnectEvent(){
    console.log('disconnected');
  }
  function onScrollHandler(event){
    const elem = event.target;
    console.log('elem.scrollHeight', elem.scrollHeight);
    console.log('elem.scrollTop', elem.scrollTop)
    console.log('elem.clientHieght', elem.clientHeight)
    console.log('Math.round(elem.scrollHeight  - elem.scrollTop)', Math.round(elem.scrollHeight  - elem.scrollTop))
    if(Math.round(elem.scrollHeight  - elem.scrollTop) === elem.clientHeight){
      setScrollBottom(false);
    }else{
      setScrollBottom(true);
    }
  }
  
  const handleScrollHeightChange = (e) => {
    console.log('scroll height', e);
    setScrollBottom(true);
   
  };
  useEffect(()=>{
    socket.on('connect',onConnectionEvent);
    socket.on('disconnect', onDisconnectEvent);
    socket.on('MESSAGE',onMessageEvent)
    socket.connect();
    // Use MutationObserver to observe changes in scrollHeight
    const observer = new MutationObserver(handleScrollHeightChange);
    if(chatRef.current){
      chatRef.current.addEventListener('scroll',onScrollHandler);
      observer.observe(chatRef.current, {
        // attributes: true,
        // attributeFilter: ['scrollHeight'],
        childList: true, // Optional: if new items are added as child nodes
        // subtree: true, // Optional: if new items are added in nested elements
      });
    }
    

    
    

    async function getMessages() {
      try{
        const response = await getChatMessages(chatId);
        setMessages(response.data.data)
      }catch(e){
        console.log("Error while fetching messages");
      }
      
    }
    getMessages();
    
  
      
      
    return ()=>{ 
      socket.disconnect();
      socket.off('connect', onConnectionEvent);
      socket.off('MESSAGE', onMessageEvent);
      if(chatRef.current){
        chatRef.current.removeEventListener('onScroll', onScrollHandler);
      }
      observer.disconnect();
    }
    },[])

  // Mock messages - in a real app, you would fetch these
  // const messages = [
  //   { id: "1", senderId: userId, text: "Hey there!", timestamp: "10:30 AM" },
  //   { id: "2", senderId: "me", text: "Hi! How are you?", timestamp: "10:31 AM" },
  //   { id: "3", senderId: userId, text: "I'm good, thanks! Just wanted to check in.", timestamp: "10:32 AM" },
  //   { id: "4", senderId: "me", text: "That's great to hear. I've been meaning to catch up.", timestamp: "10:33 AM" },
  // ]

  const sendMessage = async()=>{
    try{
      const response = await postChatMessage(message, chatId);
      if(response){
        setMessage('');
        setMessages((prev)=> ([...prev, response.data.data]));
      }
      
    }catch(e){
      console.log('error while sending one-onone message');
    }
    
  }
  const getTime = (date) =>{
    date = new Date(date);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  }
  console.log(user);
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.fullname.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{user.name}</h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
      {
          scrollBottom && 
          <div
          onClick={()=>{
            chatRef.current.scrollTo(0,chatRef.current.scrollHeight);
          }}
          className="fixed bottom-8 right-8 bg-gray-400 p-4 rounded-md">
            <ChevronsDown size={32}/>
          </div>
        }
      <div
      ref={chatRef}
      className="flex-1 overflow-y-auto p-4 space-y-4">
        
        
        {messages.map((message) => {
          // console.log(message.sender + " " + user.id);
          return (
          <div key={message._id} className={`flex ${message.sender === recieverId ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[70%] rounded-lg p-3 flex flex-col ${
                message.sender === user?.id ? "bg-primary text-primary-foreground  items-end" : "bg-muted items-start"
              }`}
            >
              <p>{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {getTime(message.updatedAt)}
              </p>
            </div>
          </div>
        )
        })}
      </div>

      <div className="border-t p-4">
        <form className="flex gap-2" onSubmit={(e)=>{
          e.preventDefault();
          sendMessage()
          }}>
          <Input 
          placeholder="Type a message..." 
          className="flex-1"
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

