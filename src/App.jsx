import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './AuthContext';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import ChatInterface from './ChatInterface';
import Logout from './Logout';
import ProtectedRoute from './ProtectedRoute';
import UserProfile from './UserProfile';
import NavLinks from './NavLinks';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <NavLinks />
          </div>
        </nav>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/chat'
            element={
              <ProtectedRoute>
                <ChatInterface />
              </ProtectedRoute>
            }
          />
          <Route path="/user-profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path='/logout' element={<Logout />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;