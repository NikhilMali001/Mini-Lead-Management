const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getToken = () => localStorage.getItem('lead-management-token');

const headers = (json = true) => {
  const authToken = getToken();
  return {
    'Content-Type': json ? 'application/json' : undefined,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'API request failed');
  }
  return data;
};

export const post = (url, body) =>
  request(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });

export const get = (url) =>
  request(url, {
    method: 'GET',
    headers: headers(),
  });

export const put = (url, body) =>
  request(url, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });

export const del = (url) =>
  request(url, {
    method: 'DELETE',
    headers: headers(),
  });
