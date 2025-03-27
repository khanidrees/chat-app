import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({children})=>{
    const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem("token")||'';
    setToken(storedToken);
    setLoading(false); 
  }, []);
    return <AuthContext.Provider value ={{loading, token, setToken}}>
    {children}
    </AuthContext.Provider>
}

export const useAuth = () =>{
  return useContext(AuthContext);
}