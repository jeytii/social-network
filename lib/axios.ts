import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import Cookies from 'js-cookie';

const bearerToken = Cookies.get('token');

export default (token = bearerToken): AxiosInstance => {
    const headers: AxiosRequestHeaders = {
        Accept: 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_APP_URL,
        withCredentials: true,
        headers,
    });
};
