import { GetServerSideProps } from 'next';
import { axiosServer } from 'config/axios';
import Users from 'components/layouts/Users';

export default function Search() {
    return (
        <Users
            className='p-lg'
            queryKey='users'
            url='/api/users'
            enabled={false}
        />
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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
            axiosServer(req.cookies.token).get('/private'),
            axiosServer(req.cookies.token).get('/api/notifications/count'),
        ]);

        return {
            props: {
                title: 'Search people',
                isPrivate: true,
                user: responses[0].data.data,
                notificationsCount: responses[1].data.data,
            },
        };
    } catch (e) {
        return defaultReturn;
    }
};
