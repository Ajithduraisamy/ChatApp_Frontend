import { useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="container mt-5">
      <h2>You have been logged out</h2>
    </div>
  );
}
