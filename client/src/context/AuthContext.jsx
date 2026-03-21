import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { isLoaded: authLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user: clerkUser, isLoaded: userLoaded } = useClerkUser();
  const [user, setUser] = useState(null); // Database profile mapping
  const [loading, setLoading] = useState(true);

  // Sync with backend whenever clerk auth state changes
  useEffect(() => {
    const syncUser = async () => {
      if (!authLoaded || !userLoaded) return;
      
      if (isSignedIn && clerkUser) {
        try {
          const token = await getToken();
          const res = await api.post('/auth/sync', {
            email: clerkUser.primaryEmailAddress?.emailAddress,
            username: clerkUser.username || clerkUser.fullName,
            avatar: clerkUser.imageUrl
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          console.error("Error syncing user with system database:", err);
          // Fallback: even if backend sync fails, use Clerk data so ProtectedRoute
          // doesn't falsely redirect to login
          setUser({ id: clerkUser.id, email: clerkUser.primaryEmailAddress?.emailAddress });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    syncUser();
  }, [isSignedIn, clerkUser, authLoaded, userLoaded, getToken]);

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, refreshUser, loading: loading || !authLoaded || !userLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
