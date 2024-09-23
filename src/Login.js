// src/Login.js
import React, { useState } from 'react';
import './Login.css'; 

const Login = ({ onLogin, setUsername }) => {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username == "user" && password == "password") {
      setUsername(username); // Set the username in the parent component
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
