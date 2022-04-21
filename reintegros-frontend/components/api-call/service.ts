import { IResponse } from './types';
import axios from 'axios';
import Cookies from 'universal-cookie';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API });
//Send token in all requests

client.interceptors.request.use(
  async (config) => {
    const cookies = new Cookies();
    const access = cookies.get('access');

    if (access) {
      config.headers = {
        Authorization: `Bearer ${access}`,
      };
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
//Refresh token and retry on 401 error
client.interceptors.response.use(
  (response) => response,
  async function (error) {
    const cookies = new Cookies();
    const originalRequest = error.config;
    const refresh = cookies.get('refresh');
    //If token is expired and exist refresh is saved on cookies i can try renew access
    if (error.response?.status === 401 && !originalRequest._retry && refresh) {
      originalRequest._retry = true;
      const res = await axios.post('api/token/refresh/', { refresh });
      const { access } = res.data;

      if (access) {
        cookies.set('access', access, { path: '/' });
      } else {
        //Refresh is invalid. TODO redirect login
        cookies.remove('access');
        cookies.remove('refresh');
      }
      return client(originalRequest);
    }
    return Promise.reject(error);
  },
);

const handleError = async (error) => {
  return Promise.reject(error);
};

const handleSuccess = (response: IResponse) => {
  return response;
};

const request = async (options: any): Promise<IResponse> => {
  return client(options).then(handleSuccess).catch(handleError);
};

const post = async (url: string, data: {}): Promise<IResponse> => {
  return request({ url: `${url}/`, data, method: 'POST' });
};

const get = async (url: string): Promise<IResponse> => {
  return request({ url, method: 'GET' });
};

const remove = async (url: string, id: number): Promise<IResponse> => {
  return request({ url: `${url}/${id}/`, method: 'DELETE' });
};
const put = async (url: string, data: {}, id: number): Promise<IResponse> => {
  return request({ url: `${url}/${id}/`, data, method: 'PUT' });
};
const patch = async (url: string, data: {}, id: number): Promise<IResponse> => {
  return request({ url: `${url}/${id}/`, data, method: 'PATCH' });
};

export { post, request as send, client, get, put, remove, patch };
