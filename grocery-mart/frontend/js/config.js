const API_BASE_URL = '/api';
const TOKEN_KEY = 'grocery_token';
const USER_KEY = 'grocery_user';

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const getUser = () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
};

const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
const removeUser = () => localStorage.removeItem(USER_KEY);

const isAuthenticated = () => !!getToken();

const logout = () => {
    removeToken();
    removeUser();
    window.location.href = '/index.html';
};

const apiCall = async (url, options = {}) => {
    // allow callers to opt out of automatic logout-on-401 by passing
    // { skipAuthRedirect: true } in options
    const { skipAuthRedirect, headers: optHeaders, ...restOptions } = options;

    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...optHeaders
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...restOptions,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401 && !skipAuthRedirect) {
                logout();
            }
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

