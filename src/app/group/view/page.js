'use client';

import { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';
import MenuNav from '../../../components/menu_nav';
import { db } from '../../../utils/firebase_store';
import { getCurrentUser } from '@/utils/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const ViewGroupPage = () => {
    const router = useRouter();
  const [groupMembers, setGroupMembers] = useState([]);
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser) {
        router.push('/login');
      }
    
    const userCredential = firebase.auth().signInAnonymously(currentUser);
        
    // Get the user document
    const userDocRef = db.collection('users').doc(currentUser);
    userDocRef.get().then((userDoc) => {
      if (userDoc.exists) {
        // Get the group name from the user document
        const groupName = userDoc.data().group;

        // Get the group members
        const groupDocRef = db.collection('users').doc(groupName);
        groupDocRef.get().then((groupDoc) => {
            if (groupDoc.exists) {
              const members = groupDoc.data().members;
              setGroupMembers(members);
  
              // Fetch liked recipes for each group member
              members.forEach((member) => {
                if (member !== currentUser) {
                  const memberDocRef = db.collection('users').doc(member);
                  memberDocRef.get().then((memberDoc) => {
                    if (memberDoc.exists) {
                      const likedRecipes = memberDoc.data().likedRecipes || [];
                      // Compare liked recipes and find matches
                      likedRecipes.forEach((recipeId) => {
                        if (userDoc.data().likedRecipes.includes(recipeId)) {
                          setMatchedRecipes((prevMatches) => new Set(prevMatches).add(recipeId));
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }, []);
  
    return (
      <div>
        <MenuNav />
        <div>
          <h1>View Group</h1>
          <p>Group Members: {groupMembers.join(', ')}</p>
          <p>Matched Recipes: {[...matchedRecipes].join(', ')}</p>
        </div>
      </div>
    );
  };

export default ViewGroupPage;