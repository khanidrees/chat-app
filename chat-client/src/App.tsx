import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './components/Home'
import { AuthProvider } from './Contexts/AuthContext'
import Layout from './components/Layout'
import SearchPage from './pages/SearchPage'
import ProtectedRoute from './components/ProtectedRoute'
import ChatPage from './pages/ChatPage'

function App() {

  return (
  <div >  
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route element={<ProtectedRoute/>} >
            <Route path='/' element={<Layout/>}
            >
              <Route index element={<SearchPage/>}/>
              <Route path='/chats/:userId' element={<ChatPage/>}/>
            </Route>
          </Route>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </div>
  )
}

export default App
