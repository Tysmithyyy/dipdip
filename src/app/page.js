'use client';

import { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';
import MenuNav from '../components/menu_nav';
import RecipeCard from '../components/swipeable_recipe';
import { apiFetch } from '../utils/api';
import { getCurrentUser } from '../utils/auth';
import { addLikedRecipes } from '@/utils/firebase_store'; 

const HomePage = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }

    const fetchRecipes = async () => {
      try {
        const params = {
          type: 'main course',
          number: 60,
        };

        const data = await apiFetch(params);
        setRecipes(data.results);
      } catch (error) {
        console.error('Error fetching recipes:', error.message);
      }
    };

    fetchRecipes();
  }, [currentUser, router]);

  const handleSwipe = (direction) => {
    if (direction === 'up' && currentRecipeIndex > 0) {
      setCurrentRecipeIndex(currentRecipeIndex - 1);
    } else if (direction === 'down' && currentRecipeIndex < recipes.length) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
    }
  };

  const handleNextCard = (direction) => {
    if (direction === 'up') {
      addLikedRecipes(currentUser, recipes[currentRecipeIndex].id);
    }
    setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  return (
    <div>
      <MenuNav />
      <div className="content">
        { currentUser && (
          <h2 className="welcomeText">Welcome, {currentUser}!</h2>
        )}
        {recipes.length > 0 && (
          <RecipeCard
            recipe={recipes[currentRecipeIndex]}
            onNextCard={handleNextCard}
            onSwipe={handleSwipe}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;