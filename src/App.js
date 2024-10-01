// src/App.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register'; // Import the Register component
import Dashboard from './Dashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // State for registration
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRegister = () => {
    setIsRegistering(false); // Close registration
  };

  return (
    <div>
      {isLoggedIn ? (
        <Dashboard username={username} />
      ) : isRegistering ? (
        <Register onRegister={handleRegister} />
      ) : (
        <Login onLogin={handleLogin} setUsername={setUsername} />
      )}
      {!isLoggedIn && (
        <button className="register-button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'New here? Register'}
        </button>
      )}
    </div>
  );
};

export default App; // Ensure this is at the bottom
