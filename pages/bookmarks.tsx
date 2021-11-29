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
        />
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    if (!req.cookies || !req.cookies.token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
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
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};
