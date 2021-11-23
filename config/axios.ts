import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export const axiosClient = (): AxiosInstance => {
    const token = Cookies.get('token');
    let headers = {};

    if (token) {
        headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        };
    } else {
        headers = {
            Accept: 'application/json',
        };
    }

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_APP_URL,
        withCredentials: true,
        headers,
    });
};

export const axiosServer = (token: string): AxiosInstance =>
    axios.create({
        baseURL: process.env.APP_URL,
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
