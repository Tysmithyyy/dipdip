import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import firebaseConfig from '../../firebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export const getLikedRecipes = async (username) => {
  const userDoc = await db.collection('users').doc(username).get();
  return userDoc.exists ? userDoc.data().likedRecipes : [];
};

export const addLikedRecipes = async (username, recipes) => {
  const userCredential = await firebase.auth().signInAnonymously(username);
  const userRef = db.collection('users').doc(username);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const likedRecipes = userDoc.data().likedRecipes || [];
    likedRecipes.push(recipes);
    await userRef.update({ likedRecipes });
  } else {
    await userRef.set({ likedRecipes: [recipes] });
  }
};

export const clearLikedRecipes = async (username) => {
  const userRef = db.collection('users').doc(username);
  await userRef.update({ likedRecipes: [] });
};

export { db };