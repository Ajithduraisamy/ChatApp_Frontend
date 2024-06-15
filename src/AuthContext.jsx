import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      axios.get('https://chatapp-backend-09n7.onrender.com/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(userResponse => {
          const { userId } = userResponse.data;
          localStorage.setItem('userId', userId);
          axios.get('https://chatapp-backend-09n7.onrender.com/contacts', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(contactsResponse => {
              setUser({ token, userId, contacts: contactsResponse.data.contacts });
              setLoading(false);
            })
            .catch(error => {
              console.error("Failed to fetch contacts", error);
              setLoading(false);
            });
        })
        .catch(error => {
          console.error("Failed to fetch user data", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const userResponse = await axios.get('https://chatapp-backend-09n7.onrender.com/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const { userId } = userResponse.data;
      localStorage.setItem('userId', userId);

      const contactsResponse = await axios.get('https://chatapp-backend-09n7.onrender.com/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser({ token, userId, contacts: contactsResponse.data.contacts });
      navigate('/chat');
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
