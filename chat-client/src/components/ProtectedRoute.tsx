import { useAuth } from '@/Contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { loading , token , setToken  } = useAuth();
  console.log(loading,token);
  if(loading) return <h1>Loading</h1>
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;