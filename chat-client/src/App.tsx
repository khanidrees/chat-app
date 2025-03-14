import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import { AuthProvider } from './Contexts/AuthContext'

function App() {

  return (
  <div className='flex justify-center'>  
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
          path='/'
          element={<Home/>}
          />
          <Route
          path='/login'
          element={<Login/>}
          />
          <Route
          path='/signup'
          element={<Signup/>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </div>
  )
}

export default App
