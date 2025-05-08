export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('authToken'); // Replace with your token retrieval logic
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
