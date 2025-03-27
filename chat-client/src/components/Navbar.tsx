import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { MessageSquare, Search, User, Users, LogOut  } from "lucide-react"

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Search",
      href: "/",
      icon: <Search className="h-5 w-5" />,
    },
    {
      name: "Chats",
      href: "/chats",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Groups",
      href: "/groups",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ]

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }
  function logoutHandler(){
    localStorage.setItem('token', '');
    navigate('/login')
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="mx-6 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-xl font-bold">ChatApp</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Button key={item.href} variant={isActive(item.href) ? "default" : "ghost"} asChild>
                <Link to={item.href} className="flex items-center gap-2">
                  {item.icon}
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              </Button>
            ))}
            <Button 
            variant={'destructive'}
            onClick={()=>logoutHandler()}
            >
                <div className="flex items-center gap-2">
                  {<LogOut/>}
                  <span className="hidden sm:inline">{'Logout'}</span>
                </div>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

