import axios, { AxiosInstance } from 'axios';

export default function axiosInstance(
    token: string | null = null,
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
