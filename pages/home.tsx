import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useQueryClient } from 'react-query';
import TextBox from 'components/utilities/TextBox';
import Spinner from 'components/vectors/Spinner';
import authenticate from 'lib/auth';
import type { User } from 'types/user';

const Posts = dynamic(() => import('components/macro/Posts'), {
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

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('auth', props, {
        title: 'Home',
    });
