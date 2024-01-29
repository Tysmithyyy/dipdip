'use client';

// pages/login.js
import { useState, useEffect } from 'react';
import { signInWithUsername, getCurrentUser, setCurrentUser } from '../../utils/auth';
import LoginForm from '../../components/login_form';
import MenuNav from '../../components/menu_nav';
import { useRouter } from 'next/navigation';
import styles from '../../styles/login.module.css';  // Import the CSS file

const LoginPage = () => {
    const router = useRouter();
    const [currentUser, setCurrentUserState] = useState(getCurrentUser()); // Initialize currentUser
  
    useEffect(() => {
      // Redirect to the main dashboard if the user is already logged in
      if (currentUser) {
        router.push('/');
      }
    }, [currentUser, router]);
  
    const handleLogin = async (username) => {
      try {
        // Sign in with the provided username using Firebase
        await signInWithUsername(username);
  
        // Set the current user in state and local storage
        setCurrentUser(username);
        setCurrentUserState(username);
  
        // Redirect to the main dashboard or landing page after login
        router.push('/');
      } catch (error) {
        console.error('Login error:', error.message);
        // Handle login error if necessary
      }
    };
  
    return (
      <div>
        <MenuNav />
        <div className={styles.layout}>
          <h1>Welcome to the Recipe App</h1>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  };
  
  export default LoginPage;