import { GetServerSidePropsContext } from 'next';
import axios from './axios';

export default async function authenticate(
    middleware: 'guest' | 'auth',
    { req }: GetServerSidePropsContext,
    meta: Record<string, string>,
) {
    if (middleware === 'guest') {
        const props = {
            isPrivate: false,
            ...meta,
        };

        if (!req.cookies || !req.cookies.token) {
            return { props };
        }

        try {
            await axios(req.cookies.token).get('/private');

            return {
                redirect: {
                    destination: '/home',
                    permanent: false,
                },
            };
        } catch (e) {
            return { props };
        }
    } else {
        const defaultReturn = {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };

        if (!req.cookies || !req.cookies.token) {
            return defaultReturn;
        }

        try {
            const responses = await Promise.all([
                axios(req.cookies.token).get('/private'),
                axios(req.cookies.token).get('/api/notifications/count'),
            ]);

            return {
                props: {
                    isPrivate: true,
                    user: responses[0].data.data,
                    notificationsCount: responses[1].data.data,
                    ...meta,
                },
            };
        } catch (e) {
            return defaultReturn;
        }
    }
}
