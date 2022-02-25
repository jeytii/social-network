import { GetServerSideProps } from 'next';
import { lazy, Suspense } from 'react';
import Spinner from 'components/utilities/Spinner';
import authenticate from 'lib/auth';

const Posts = lazy(() => import('components/macro/Posts'));

export default function Bookmarks() {
    return (
        <Suspense fallback={<Spinner className='p-lg' />}>
            <Posts
                className='p-lg sm:px-md'
                queryKey='profile.bookmarks'
                url='/api/profile/bookmarks'
                cacheTime={Infinity}
                refetchInterval={1000 * 30}
                refetchIntervalInBackground
            />
        </Suspense>
    );
}

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('auth', props, {
        title: 'Bookmarks',
    });
