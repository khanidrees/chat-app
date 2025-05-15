import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider } from './Contexts/AuthContext'
import Layout from './components/Layout'
import SearchPage from './pages/SearchPage'
import ProtectedRoute from './components/ProtectedRoute'
import ChatPage from './pages/ChatPage'
import { ChatProvider } from './Contexts/ChatContext'

function App() {

  return (
  <div >  
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            
            <Route element={<ProtectedRoute/>} >
              <Route path='/' element={<Layout/>}
              >
                <Route index element={<SearchPage/>}/>
                {/* <Route path='chats' element={<AllChatsPage/>}/> */}
                <Route path='/chats/' element={<ChatPage/>}/>
              </Route>
            </Route>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  </div>
  )
}

export default App
