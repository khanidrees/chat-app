import { useParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Send, ChevronsDown, CheckCheck } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { getChatMessages, postChatMessage } from "@/apis"
import { useAuth } from "@/Contexts/AuthContext"
import { socket } from "@/socket"
import { debounce, getTimeHHMM } from "@/utils"
import AllChats from "./AllChats"

export default function ChatPage() {
  const [chatId, setChatId] = useState('');
  const [chats, setChats] = useState([]);
  const [recieverId, setRecieverId] = useState('');
  const { loading, token, setToken,user,setUser } = useAuth();
  const [message, setMessage] = useState('');
  const [scrollBottom, setScrollBottom] = useState(false);
  // const [isScrollable, setIsScrollable] = useState(false);
  // console.log(recieverId + " " + chatId);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const messageRefs = useRef([]);
  const [messagesToMarkAsRead, setMessagesToMarkAsRead] = useState([]);

  // Mock user data - in a real app, you would fetch this
  // const user = {
  //   id: recieverId,
  //   name: recieverId === "1" ? "John Doe" : recieverId === "2" ? "Jane Smith" : "User " + recieverId,
  //   avatar: "/placeholder.svg?height=40&width=40",
  // }
  
  const emitReadEvent = useCallback(
    debounce((messageIds) => {
      if (messageIds.length > 0) {
        socket.emit('MESSAGES_READ', JSON.stringify({
          messageIds,
          sender: recieverId
        }));
        setMessagesToMarkAsRead([]); // Clear the array after sending
      }
    }, 500), // Debounce for 500ms
    [socket, recieverId]
  );
  function onMessageRecievedEvent(payload){
    console.log("MESSAGE_RECIEVED EVENT")
    const message = JSON.parse(payload);
    if(chatId == message.chat._id){
      setMessages(prev =>([...prev, message]));
    }else{
      updateUnreadCount(message.chat._id, message.content);
    }
    
    // console.log(e);
  }
  function onConnectionEvent(){
    console.log('connected');
  }
  function onDisconnectEvent(){
    console.log('disconnected');
  }

  function onMessageReadConfirmation(messageIds){
    console.log(messageIds);
    setMessages((prev) => {
      return prev.map((m ) => {
      if(m.isRead) return m;
      return messageIds.includes(m._id) ?  {...m,isRead: true} : m;
    })
    });
  }
  function onScrollHandler(event){
    const elem = event.target;
    const threshold = 5;
    // console.log('elem.scrollHeight', elem.scrollHeight);
    // console.log('elem.scrollTop', elem.scrollTop)
    // console.log('elem.clientHieght', elem.clientHeight)
    // console.log('Math.round(elem.scrollHeight  - elem.scrollTop)', Math.ceil(elem.scrollHeight  - elem.scrollTop))
    if(elem.scrollTop + elem.clientHeight + threshold >= elem.scrollHeight){
      setScrollBottom(false);
    }else{
      setScrollBottom(true);
    }
  }
  
  const handleScrollHeightChange = (e) => {
    // console.log('scroll height', e);
    setScrollBottom(true);
   
  };
  useEffect(()=>{
   
    socket.connect();
    socket.on('connect',onConnectionEvent);
    socket.on('disconnect', onDisconnectEvent);
    socket.on('MESSAGE_RECIEVED',onMessageRecievedEvent)
    socket.on('MESSAGES_READ_CONFIRMATION', onMessageReadConfirmation);
    
    // Use MutationObserver to observe changes in scrollHeight
    
      
    return ()=>{ 
      // updateChat(null);
      socket.disconnect();
      socket.off('connect', onConnectionEvent);
      socket.off('MESSAGE_RECIEVED', onMessageRecievedEvent);
      socket.off('MESSAGE_READ_CONFIRMATION', onMessageReadConfirmation);
    }
    },[]);
    
    useEffect(()=>{
      let msgsobserver: IntersectionObserver;
      if(messageRefs.current?.length > 0){
        msgsobserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            // console.log(entry.target.id);
            const id = entry.target.id;
            // console.log(id);
            const message = messages.find(m=>m._id == id);
            if (entry.isIntersecting && message.sender != user.id && !message.isRead) {
              // Do something when the message div is in view
              console.log(`Message div with text "${entry.target.textContent}" is visible`);
              
              setMessagesToMarkAsRead((prevMessageIds) => {
                if (!prevMessageIds.includes(id)) {
                  return [...prevMessageIds, id];
                }
                return prevMessageIds;
              });
              // unobserve the element if you only need to observe it once
              msgsobserver.unobserve(entry.target);
            } else {
                //Do something when the message div is out of view
                console.log(`Message div with text "${entry.target.textContent}" is not visible`);
            }
          });
        }, 
        {
          root: null, // Use the viewport as the root
          rootMargin: '0px',
          threshold: 0.5, // Trigger when 10% of the element is visible
        });
    
        // console.log(messageRefs.current.length);
        // Observe each message div
        messageRefs.current.forEach(ref => {
    
          if (ref) {
            // console.log(ref);
            msgsobserver.observe(ref);
          }
        })
      }
      

      return ()=> {
        if(msgsobserver){
          msgsobserver.disconnect();
        }
        
      }
    },[messages])
    useEffect(()=>{
      let observer: MutationObserver;
      
      if(chatId){
        async function getMessages() {
          try{
            const response = await getChatMessages(chatId);
            setMessages(response.data.data)
          }catch(e){
            console.log("Error while fetching messages");
          }
          
        }
        getMessages();
        observer = new MutationObserver(handleScrollHeightChange);
   
        if(chatRef.current){
          observer.observe(chatRef.current, {
            // attributes: true,
            // attributeFilter: ['scrollHeight'],
            childList: true, // Optional: if new items are added as child nodes
            // subtree: true, // Optional: if new items are added in nested elements
          });
        }
      }
      localStorage.setItem('currChatId', chatId);

      return ()=>{
        
        if(chatId){
          chatRef.current.removeEventListener('onScroll', onScrollHandler);
          observer.disconnect();
        }
        
        localStorage.setItem('currChatId', '');
      }

    },[chatId]);

    useEffect(() => {
      // console.log(messagesToMarkAsRead);
      emitReadEvent(messagesToMarkAsRead);
    }, [messagesToMarkAsRead, emitReadEvent]);

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
  const selectChat = (chatId, recieverId)=>{
    console.log('recieverId', recieverId);
    setChatId(chatId);
    setRecieverId(recieverId);
  }

  function updateUnreadCount(chatId,message){
    setChats((prev)=>{
      return prev.map((c)=>{
        if(c._id == chatId){
          c.messages.push({});
          c.lastMessage = message;
        }
        return c;
      })
    })
  }
  
  // console.log(chatId);
  // console.log(recieverId);
  return (
    <div className="container py-6 flex justify-around">
      <AllChats 
      selectChat={selectChat}
      chats={chats}
      setChats={setChats}
      currChatId={chatId}
      />
      <div className="container">
      {chatId &&
          <div className="flex flex-col h-[calc(100vh-4rem)] container">
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
          className="flex-1 overflow-y-auto p-4 space-y-4"
          onScroll={onScrollHandler}
          >
            
            
            {messages.map((message,index) => {
              // console.log(message.sender + " " + user.id);
              return (
              <div 
              ref={(message.sender != user?.id &&!message.isRead) ? (ref => messageRefs.current[index] = ref): null}
              key={message._id.toString()}
              id={message._id.toString()}
              className={`flex ${message.sender === recieverId ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[70%] rounded-lg p-3 flex flex-col ${
                    message.sender === user?.id ? "bg-primary text-primary-foreground  items-end" : "bg-muted items-start"
                  }`}
                >
                  <p>{message.content}</p>
                  <div className="flex items-end gap-1">
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {getTimeHHMM(message.updatedAt)}
                    </p>
                    {(message.sender === user?.id)  &&
                      <CheckCheck size={16} color={ message?.isRead ? "#00ccff": 'currentColor'} />
                    }
                    
                  </div>
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
        

      }
      </div>
    </div>
  )
}

