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
        await axiosServer(req.cookies.token).get('/private');

        return {
            props: {
                title: 'Bookmarks',
                isPrivate: true,
            },
        };
    } catch (e) {
        return defaultReturn;
    }
};
