import Link from 'next/link';
import { useQuery } from 'react-query';
import User from 'components/micro/User';
import Spinner from 'components/utilities/Spinner';
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
            <p className='text-sm text-skin-primary text-center'>
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
                    <span className='text-primary-dark text-sm cursor-pointer ml-auto'>
                        Explore
                    </span>
                </Link>
            </header>

            <section>
                {data?.map(user => (
                    <User
                        key={user.slug}
                        className='bg-skin-main border border-skin-main p-sm mt-sm hover:border-primary-light'
                        {...user}
                    />
                ))}
            </section>
        </>
    );
}
