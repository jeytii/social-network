import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useQueryClient } from 'react-query';
import TextBox from 'components/utilities/TextBox';
import Spinner from 'components/vectors/Spinner';
import axios from 'lib/axios';
import type { User } from 'types/user';

const Posts = dynamic(() => import('components/layouts/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

export default function Home() {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>('user');

    async function onSuccess() {
        await Promise.all([
            queryClient.cancelQueries('posts'),
            queryClient.cancelQueries(['profile.posts', user?.slug], {
                exact: true,
            }),
        ]);

        await Promise.all([
            queryClient.invalidateQueries('posts', {
                refetchActive: true,
                refetchPage: () => true,
            }),
            queryClient.invalidateQueries(['profile.posts', user?.slug], {
                exact: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
        ]);
    }

    return (
        <div className='p-lg sm:px-md'>
            <TextBox
                buttonLabel='Post'
                value=''
                apiUrl='/api/posts'
                apiMethod='post'
                onSuccess={onSuccess}
            />

            <Posts
                className='mt-lg'
                queryKey='posts'
                url='/api/posts'
                refetchInterval={1000 * 60}
                refetchIntervalInBackground
            />
        </div>
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
            axios(req.cookies.token).get('/private'),
            axios(req.cookies.token).get('/api/notifications/count'),
        ]);

        return {
            props: {
                title: 'Home',
                isPrivate: true,
                user: responses[0].data.data,
                notificationsCount: responses[1].data.data,
            },
        };
    } catch (e) {
        return defaultReturn;
    }
};
