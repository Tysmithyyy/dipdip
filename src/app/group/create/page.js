'use client';

import { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';
import MenuNav from '../../../components/menu_nav';
import { db } from '../../../utils/firebase_store';
import { getCurrentUser } from '@/utils/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const CreateGroupPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [groupname, setGroupname] = useState('');
    const [currentUser] = useState(getCurrentUser());

    useEffect(() => {
        if (!currentUser) {
          router.push('/login');
        }
      }, [currentUser, router]);
  
    const handleCreateGroup = async () => {
        const userCredential = await firebase.auth().signInAnonymously(username);
        
      // Check if the username exists
      const userlistDoc = await db.collection('users').doc('userlist').get();
      const usernames = userlistDoc.data().username;
  
      if (usernames.includes(username)) {
        // Username exists, proceed to create a group
        const names = [username, currentUser];
        // Create a new group document

        console.log('names', names);
        await db.collection('users').doc(groupname).set({
          members: names,
        });
  
        // Update the grouplist document
        await db.collection('users').doc('grouplist').update({
          [groupname]: names,
        });

        await db.collection('users').doc(username).update({
          group: groupname,
        });

        await db.collection('users').doc(currentUser).update({
            group: groupname,
          });
  
        console.log('Group created successfully!');
      } else {
        console.error('Username does not exist.');
      }
    };
  
    return (
      <div>
        <MenuNav />
        <div>
          <h1>Create Group</h1>
          <label>
            Enter Your Friend's Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
          <label>
            Enter Group Name:
            <input type="text" value={groupname} onChange={(e) => setGroupname(e.target.value)} />
          </label>
          <br />
          <button onClick={handleCreateGroup}>Create Group</button>
        </div>
      </div>
    );
  };
  
  export default CreateGroupPage;