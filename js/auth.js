const API_URL = 'https://api.escuelajs.co/api/v1';
const AUTH_URL = `${API_URL}/auth/login`;

export const login = async (email, password) => {
    try {
        const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }
        const data = await response.json();
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('userEmail', email);
        return data;
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
};
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
};
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};