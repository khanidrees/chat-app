import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { useEffect } from "react"
import { socket } from "@/socket"


export default function Layout() {
    

    
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}