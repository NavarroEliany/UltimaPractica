import { getAuthToken } from './auth.js';

const API_URL = 'https://api.escuelajs.co/api/v1';

export const fetchData = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

export const postData = async (endpoint, data) => {
    return fetchData(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
};