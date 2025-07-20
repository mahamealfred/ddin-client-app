import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import eventBus from './eventBus';

const ACCESS_TOKEN_KEY = 'mahameb';
const REFRESH_TOKEN_KEY = 'mahameb_refresh_token';

export const storeTokens = async ({ accessToken, refreshToken }) => {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, accessToken],
    [REFRESH_TOKEN_KEY, refreshToken]
  ]);
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
};


export const isTokenValid = async () => {
  const token = await getAccessToken();
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (error) {
    return false;
  }
};

export const logout = async () => {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  eventBus.emit('LOGOUT'); 
};