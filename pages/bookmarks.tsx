import { GetServerSideProps } from 'next';
import Posts from 'components/macro/Posts';
import authenticate from 'lib/auth';

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

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('auth', props, {
        title: 'Bookmarks',
    });
