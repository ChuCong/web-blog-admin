import axios from 'axios';
import JwtService from './jwt.service';
import router from '@/router';
import type { AxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

instance.interceptors.request.use((config) => {
  const token = JwtService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data?.errorCode === 401) {
      JwtService.destroyToken();
      router.push({ name: 'login' });
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      JwtService.destroyToken();
      router.push({ name: 'login' });
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  query(resource, params) {
    return instance.get(resource, { params });
  },
  get(resource, id: number|null = null) {
    return instance.get(id ? `${resource}/${id}`: `${resource}`);
  },
  post(resource, params, config: AxiosRequestConfig = {}) {
    return instance.post(resource, params, config);
  },
  update(resource, id, params) {
    return instance.put(`${resource}/${id}`, params);
  },
  update1(resource, params) {
    return instance.put(resource, params);
  },
  put(resource, params) {
    return instance.put(resource, params);
  },
  delete(resource, param) {
    return instance.delete(`${resource}/${param}`);
  },
  patch(resource, params) {
    return instance.patch(resource, params);
  },
  export(resource) {
    return instance.get(resource, { responseType: 'blob' });
  }
};

export default ApiService;
