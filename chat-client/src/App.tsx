import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'

function App() {

  return (
    <div className='flex justify-center'>

    
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
  </div>
  )
}

export default App
