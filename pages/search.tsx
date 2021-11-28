import { GetServerSideProps } from 'next';
import { axiosServer } from 'config/axios';
import Users from 'components/layouts/Users';

export default function Search() {
    return <Users className='p-lg' queryKey='users' url='/api/users' />;
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
                title: 'Search people',
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
