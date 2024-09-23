// src/App.js
import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <div>
      {isLoggedIn ? (
        <Dashboard username={username} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} setUsername={setUsername} />
      )}
    </div>
  );
};

export default App;
