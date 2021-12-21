import Axios from 'axios';
import { message } from 'antd';

// @ts-ignore
const { VITE_API: API } = import.meta.env;

const instance = Axios.create({
  baseURL: API as string,
  timeout: 5000,
});

instance.interceptors.request.use(
  (config: any) => {
    const newConfig = { ...config };
    const token = localStorage.getItem('token');
    newConfig.headers.Authorization = `Bearer ${token}`;
    return newConfig;
  },
  (err) => Promise.reject(err),
);

instance.interceptors.response.use(
  (response) => {
    const { status, data } = response;
    if (data.code !== 0) {
      message.error(data.message);
      return Promise.reject(data);
    }

    if (status !== 200) {
      message.error('请求出错');
      return Promise.reject(data);
    }
    return data;
  },
  (err) => {
    const { status } = err.response;
    message.error(err.message);
    if (status === 401) {
      message.error('登录已过期，请重新登录');
      setTimeout(() => {
        location.replace('/login');
      }, 1000);
    }
    return Promise.reject(err);
  },
);

export default instance;
