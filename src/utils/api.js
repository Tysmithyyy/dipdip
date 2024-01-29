const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY; // Replace with your Spoonacular API key

export const apiFetch = async (params) => {
  const url = new URL(BASE_URL);
  url.searchParams.append('apiKey', API_KEY);

  // Add other parameters as needed
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};