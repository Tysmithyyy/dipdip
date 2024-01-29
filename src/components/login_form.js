import { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    // Basic validation, you can add more checks as needed
    if (username.trim() !== '') {
      onLogin(username);
    } else {
      alert('Please enter a valid username.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default LoginForm;