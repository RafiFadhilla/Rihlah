import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminRoutes from './routes/AdminRoutes';
import PublicRoutes from './routes/PublicRoutes';
import { useToast } from "@/components/ui/use-toast";
import Loading from './components/Loading';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setInitializing(false);
      return;
    }

    try {
      const response = await fetch('YOUR_API_BASE_URL/api/v1/user', {
        headers: {
          'apiKey': 'YOUR_API_KEY',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthenticated(true);
        setUserRole(userData.data.role);
        localStorage.setItem('user', JSON.stringify(userData.data));
      } else {
        // Token is invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      toast({
        title: "Authentication error",
        description: "Please try logging in again.",
        variant: "destructive",
      });
    } finally {
      setInitializing(false);
    }
  };

  if (initializing) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          authenticated && userRole === 'admin' ? (
            <AdminRoutes />
          ) : authenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Public Routes */}
      <Route path="/*" element={<PublicRoutes isAuthenticated={authenticated} userRole={userRole} />} />
    </Routes>
  );
};

export default App;