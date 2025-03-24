export const baseUrl = process.env.NODE_ENV === 'production' 
  ? process.env.NEXTAUTH_URL // Use the environment variable for production
  : 'http://localhost:3000';

export const fetcher = async (url) => {
  const res = await fetch(`${baseUrl}${url}`); // Use the base URL with the endpoint
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
};
