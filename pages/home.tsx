import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Protected from 'components/Protected';
import PostBox from 'components/chunks/PostBox';
import Spinner from 'components/vectors/Spinner';
import axios from 'config/axios';

const Posts = dynamic(() => import('components/layouts/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

export default function Home() {
    return (
        <Protected title='Home'>
            <div className='p-lg sm:px-md'>
                <PostBox />
                <Posts />
            </div>
        </Protected>
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
        await axios(req.cookies.token).get(`${process.env.APP_URL}/private`);

        return {
            props: {},
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
