import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useQueryClient } from 'react-query';
import TextBox from 'components/utilities/TextBox';
import Spinner from 'components/vectors/Spinner';
import { axiosServer } from 'config/axios';
import type { User } from 'types/user';

const Posts = dynamic(() => import('components/layouts/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

export default function Home() {
    const queryClient = useQueryClient();

    async function successEvent() {
        const user = queryClient.getQueryData<User>('user');

        await queryClient.invalidateQueries('posts', {
            refetchPage: () => true,
        });

        await queryClient.invalidateQueries(['profile.posts', user?.slug], {
            refetchInactive: true,
            refetchPage: () => true,
        });
    }

    return (
        <div className='p-lg sm:px-md'>
            <TextBox
                placeholder="What's on your mind?"
                buttonLabel='Post'
                value=''
                apiUrl='/api/posts'
                apiMethod='post'
                successEvent={successEvent}
            />

            <Posts className='mt-lg' queryKey='posts' url='/api/posts' />
        </div>
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
                title: 'Home',
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
