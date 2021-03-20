import axios from 'axios';

const token = window.localStorage.getItem('token');

export const api = axios.create({
  baseURL: '/api',
  responseType: 'json',
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
