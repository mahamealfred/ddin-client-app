

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventBus from './eventBus';

const api = axios.create({
  baseURL: 'http://192.168.0.237:3000/v1',
 timeout: 120000
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('mahameb'); // or whatever key you use
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      await AsyncStorage.multiRemove(['mahameb', 'mahameb']); // Clear tokens
      eventBus.emit('LOGOUT'); // Notify app to redirect to Auth screen
    }

    return Promise.reject(error);
  }
);

export default api;
