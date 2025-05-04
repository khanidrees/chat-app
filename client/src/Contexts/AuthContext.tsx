import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({children})=>{
    const [token, setToken] = useState('');
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); 
  // console.log('Auth Rendered: ')
  useEffect(() => {
    const storedToken = localStorage.getItem("token")||'';
    const storedUser = localStorage.getItem("user")||'{}';
    setToken(storedToken);
    setUser(JSON.parse(storedUser))
    setLoading(false); 
  }, []);
    return <AuthContext.Provider value={{loading, token, setToken,user,setUser}}>
    {children}
    </AuthContext.Provider>
}

export const useAuth = () =>{
  return useContext(AuthContext);
}