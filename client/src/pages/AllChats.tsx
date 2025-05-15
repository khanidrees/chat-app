import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom";
import { getTimeHHMM } from "@/utils"
import {  useState, useEffect } from "react";
import { getAllChats } from "@/apis";
import { useAuth } from "@/Contexts/AuthContext";

export default function AllChats({selectChat, chats, setChats, currChatId}) {
  
  useEffect(()=>{
    async function getChats() {
      try{
        const response = await getAllChats();
        setChats(response.data.data)
      }catch(e){
        console.log("Error while fetching messages");
      }
      
    }
    getChats();
  },[])

  
  // Mock data for recent chats
  // const recentChats = [
  //   {
  //     id: "1",
  //     name: "John Doe",
  //     lastMessage: "Hey, how are you?",
  //     time: "2m ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //   },
  //   {
  //     id: "2",
  //     name: "Jane Smith",
  //     lastMessage: "Can we meet tomorrow?",
  //     time: "1h ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //   },
  //   {
  //     id: "3",
  //     name: "Robert Johnson",
  //     lastMessage: "Thanks for your help!",
  //     time: "3h ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //   },
  // ]

  return (
    <div className=" py-6  min-w-xs mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Chats</h1>

      <div className="space-y-4">
        {chats.map((chat) => (
            <Card 
            key={chat._id}
            onClick={()=>selectChat(chat._id, chat.reciever[0]?._id)}
            className={"hover:bg-accent/50 hover:bg-blue-100 transition-colors py-0 "+ (chat._id.toString()===currChatId ? "bg-blue-300": '')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={chat.avatar} alt={chat.reciever.fullname} />
                    <AvatarFallback>{chat.reciever[0].fullname.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{chat.reciever[0].fullname}</h3>
                      { chat?.messages?.length != 0 && 
                        <div
                        className="rounded-full bg-green-800 w-8 h-8 text-white font-bold text-center"
                        >{chat?.messages?.length}</div>
                      }
                      <span className="text-xs text-muted-foreground">{getTimeHHMM(chat.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate justify-self-start">{chat?.lastMessage?.[0]?.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}

