import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
    baseURL: API_URL
})

export const searchUsers = async (query) => {
  const response = await axios.get(`${API_URL}/auth/search?query=${query}`);
  return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data; // returns token
}

export const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data; // returns token
}
