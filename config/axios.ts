import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const authToken = Cookies.get('token');

export default function axiosInstance(
    token: string | undefined = authToken,
): AxiosInstance {
    let headers = {};

    if (token) {
        headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        };
    }

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_APP_URL,
        withCredentials: true,
        headers,
    });
}
