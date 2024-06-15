import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-8 text-center">
          <h1 className="display-4">Welcome to <span className='text-primary'>Hey Pal!</span> ChatApp</h1>
          <p className="lead">Connect with your friends and colleagues instantly with our real-time chat application.</p>
          <div className="mt-4">
            <Link to="/register" className="btn btn-primary btn-lg mx-2">Register</Link>
            <Link to="/login" className="btn btn-secondary btn-lg mx-2">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
