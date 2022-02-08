import { GetServerSideProps } from 'next';
import Users from 'components/macro/Users';
import authenticate from 'lib/auth';

export default function Search() {
    return (
        <Users
            className='p-lg'
            queryKey='users'
            url='/api/users'
            enabled={false}
        />
    );
}

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('auth', props, {
        title: 'Search people',
    });
