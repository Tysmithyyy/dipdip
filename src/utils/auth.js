import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import firebaseConfig from "../../firebaseConfig";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const USER_STORAGE_KEY = 'recipeAppCurrentUser';
const db = firebase.firestore();

// Function to set the current user in local storage
export const setCurrentUser = (user) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

// Function to get the current user from local storage
export const getCurrentUser = () => {
  if (typeof localStorage !== 'undefined') {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }
  return null;
};

// Function to clear the current user from local storage
export const clearCurrentUser = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

// Function to sign in with a username and handle Firestore setup
export const signInWithUsername = async (username) => {
  try {
    // Sign in with the provided username using Firebase
    const userCredential = await firebase.auth().signInAnonymously(username);

    // Check if the username is already in the user list
    const userlistDoc = await db.collection('users').doc('userlist').get();

    if (!userlistDoc.data().username.includes(username)) {
      // If not, add it to the user list
      await db.collection('users').doc('userlist').update({
        username: firebase.firestore.FieldValue.arrayUnion(username),
      });

      // Create a document for the user's recipes
      await db.collection('users').doc(username).set({ likedRecipes: [] });
    }

    // Set the current user in local storage
    setCurrentUser(username);

    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};