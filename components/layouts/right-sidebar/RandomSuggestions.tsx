import { useEffect } from 'react';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import User from 'components/utilities/User';
import Spinner from 'components/vectors/Spinner';
import axios from 'config/axios';
import type { User as UserType } from 'types/user';

async function getUsers() {
    const { data } = await axios(Cookies.get('token')).get('/api/users/random');

    return data.data;
}

export default function RandomSuggestions() {
    const { data, refetch, isLoading, isRefetching, isSuccess } = useQuery<
        unknown,
        unknown,
        UserType[]
    >('suggestions', getUsers, {
        enabled: false,
    });

    function refresh() {
        refetch();
    }

    useEffect(() => {
        refetch();
    }, []);

    if (isLoading || isRefetching) {
        return (
            <aside className='w-[280px] sticky top-[59px] left-[0px] full-height bg-skin-bg-contrast-light p-lg'>
                <Spinner />
            </aside>
        );
    }

    if (isSuccess && !data?.length) {
        return (
            <aside className='w-[280px] sticky top-[59px] left-[0px] full-height bg-skin-bg-contrast-light p-lg'>
                <p className='text-sm text-skin-text-light text-center'>
                    No suggestions left
                </p>
            </aside>
        );
    }

    return (
        <aside className='w-[280px] sticky top-[59px] left-[0px] full-height bg-skin-bg-contrast-light p-lg'>
            <header className='flex items-center'>
                <h3 className='text-skin-text-light text-md font-bold'>
                    Search people
                </h3>

                <button
                    className='text-primary text-sm cursor-pointer ml-auto'
                    type='button'
                    onClick={refresh}
                >
                    Refresh
                </button>
            </header>

            <section className='mt-sm'>
                {data?.map(user => (
                    <User
                        key={user.slug}
                        className='bg-primary-lighter p-sm'
                        {...user}
                    />
                ))}
            </section>
        </aside>
    );
}