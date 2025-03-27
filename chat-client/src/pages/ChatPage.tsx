import { useParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Send } from "lucide-react"

export default function ChatPage() {
  const { userId } = useParams<{ userId: string }>()

  // Mock user data - in a real app, you would fetch this
  const user = {
    id: userId,
    name: userId === "1" ? "John Doe" : userId === "2" ? "Jane Smith" : "User " + userId,
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Mock messages - in a real app, you would fetch these
  const messages = [
    { id: "1", senderId: userId, text: "Hey there!", timestamp: "10:30 AM" },
    { id: "2", senderId: "me", text: "Hi! How are you?", timestamp: "10:31 AM" },
    { id: "3", senderId: userId, text: "I'm good, thanks! Just wanted to check in.", timestamp: "10:32 AM" },
    { id: "4", senderId: "me", text: "That's great to hear. I've been meaning to catch up.", timestamp: "10:33 AM" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{user.name}</h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p>{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <form className="flex gap-2">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

