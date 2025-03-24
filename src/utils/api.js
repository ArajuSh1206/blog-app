 // src/utils/api.js
 export const baseUrl = process.env.NODE_ENV === 'production' 
 ? '' // Empty string for relative URLs in production
 : 'http://localhost:3000';

export const fetcher = async (url) => {
 const res = await fetch(url);
 if (!res.ok) throw new Error('An error occurred while fetching the data.');
 return res.json();
};  