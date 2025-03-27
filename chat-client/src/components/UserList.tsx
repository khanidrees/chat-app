import type { User } from "../types/user"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MessageSquare } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Skeleton } from "./ui/skeleton"
import { createOrgetChatApi } from "@/apis"

interface UserListProps {
  users: User[]
  loading: boolean
  error: string | null
  onAddUser?: (user: User) => void
  selectable?: boolean
  selectedUsers?: User[]
}

export function UserList({ users, loading, error, onAddUser, selectable = false, selectedUsers = [] }: UserListProps) {
  const navigate = useNavigate();
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No users found. Try a different search term.</p>
      </div>
    )
  }

  const isSelected = (user: User) => {
    return selectedUsers.some((selectedUser) => selectedUser.id === user.id)
  }
  async function createOrGetChat(userId: string){
      try{
        const response = await createOrgetChatApi(userId);
        if(response.data.statusCode== 200 || response.data.statusCode== 201){
          navigate('/chats/'+userId);
        }
      }catch(e){
        // TODO
        console.log(e);
      }
  }

  return (
    <div className="space-y-3">
      {users.map((user,id) => (
        <Card key={id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={'https://avatar.iran.liara.run/public/'+id} alt={user.fullname} />
                  <AvatarFallback>{user.fullname.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.fullname}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              {selectable ? (
                <Button
                  onClick={() => onAddUser && onAddUser(user)}
                  variant={isSelected(user) ? "secondary" : "default"}
                  size="sm"
                >
                  {isSelected(user) ? "Selected" : "Add"}
                </Button>
              ) : (
                <Button asChild size="sm" 
                onClick={()=>createOrGetChat(user._id)}
                >
                  <div>
                  {/* <Link to={`/chats/${user._id}`}> */}
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  {/* </Link> */}
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

