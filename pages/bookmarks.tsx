import { GetServerSideProps } from 'next';
import { axiosServer } from 'config/axios';
import Posts from 'components/layouts/Posts';

export default function Bookmarks() {
    return (
        <Posts
            className='p-lg sm:px-md'
            queryKey='profile.bookmarks'
            url='/api/profile/bookmarks'
            cacheTime={Infinity}
            refetchInterval={1000 * 30}
            refetchIntervalInBackground
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
                title: 'Bookmarks',
                isPrivate: true,
                user: responses[0].data.data,
                notificationsCount: responses[1].data.data,
            },
        };
    } catch (e) {
        return defaultReturn;
    }
};
