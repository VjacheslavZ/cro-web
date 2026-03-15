import axios from 'axios';

import { store } from '../store';
import { clearAuth, setCredentials } from '../store/auth.slice';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken } = store.getState().auth;
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });
          const user = store.getState().auth.user!;
          store.dispatch(
            setCredentials({
              user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }),
          );
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch {
          store.dispatch(clearAuth());
        }
      } else {
        store.dispatch(clearAuth());
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
