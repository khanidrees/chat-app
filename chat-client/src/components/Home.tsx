import { AuthContext } from '@/Contexts/AuthContext'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { loading, token, setToken } = useContext(AuthContext);

  function logoutHandler(){
    localStorage.setItem('token', '');
    navigate('/')
  }
  if(loading){
    return <div className='w-full h-full flex justify-center items-center'>Loading</div>
  }

  if(!token){
    navigate("/login");
  }
  return (
    <div className='w-full flex justify-around'>
      <div>Protected Route : Home</div>
      <button 
      onClick={()=>logoutHandler()}
      >Logout</button>
    </div>
    
  )
}

export default Home