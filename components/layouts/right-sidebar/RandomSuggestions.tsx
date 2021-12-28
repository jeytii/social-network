import Link from 'next/link';
import { useQuery } from 'react-query';
import User from 'components/chunks/User';
import Spinner from 'components/vectors/Spinner';
import type { User as UserType } from 'types/user';

export default function RandomSuggestions() {
    const { data, isLoading, isSuccess } = useQuery<
        unknown,
        unknown,
        UserType[]
    >('suggestions', {
        meta: {
            url: '/api/users/random',
            returnKey: 'data',
        },
    });

    if (isLoading) {
        return <Spinner />;
    }

    if (isSuccess && !data?.length) {
        return (
            <p className='text-sm text-skin-secondary text-center'>
                No suggestions to show.
            </p>
        );
    }

    return (
        <>
            <header className='flex items-center'>
                <h3 className='text-skin-secondary text-md font-bold'>
                    Search people
                </h3>

                <Link href='/search'>
                    <span className='text-primary text-sm cursor-pointer ml-auto'>
                        Explore
                    </span>
                </Link>
            </header>

            <section>
                {data?.map(user => (
                    <User
                        key={user.slug}
                        className='bg-skin-main border border-primary-transparent p-sm mt-sm'
                        {...user}
                    />
                ))}
            </section>
        </>
    );
}
