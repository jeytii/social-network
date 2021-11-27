import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useInfiniteQuery, InfiniteData } from 'react-query';
import clsx from 'clsx';
import User from 'components/chunks/User';
import Spinner from 'components/vectors/Spinner';
import { axiosServer } from 'config/axios';
import { UserPage } from 'types/page';
import { User as UserType } from 'types/user';

const formatData = ({ pageParams, pages }: InfiniteData<UserPage>) => {
    if (pages.length === 1) {
        return {
            pageParams,
            pages: pages[0].items,
        };
    }

    if (pages.length > 1) {
        return {
            pageParams,
            pages: pages.flatMap(page => [...page.items]),
        };
    }

    return { pageParams, pages: [] };
};

export default function Search() {
    const { query } = useRouter();
    const { data, refetch, isLoading, isFetching, isSuccess } =
        useInfiniteQuery<UserPage, unknown, UserType>('users', {
            enabled: false,
            meta: {
                url: '/api/users',
                ...query,
            },
            select: formatData,
        });

    useEffect(() => {
        refetch();
    }, [query]);

    if (isLoading || isFetching) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-lg font-bold text-skin-text-light opacity-50 text-center'>
                    No person to show.
                </h1>
            </section>
        );
    }

    return (
        <section className='p-lg'>
            <h1 className='text-md text-skin-text font-bold'>Search people</h1>

            <div className='mt-sm'>
                {data?.pages.map((user, index) => (
                    <User
                        key={user.slug}
                        className={clsx(
                            'bg-skin-bg-contrast-light border border-skin-bg-contrast p-sm hover:bg-skin-bg-contrast',
                            index > 0 ? 'mt-lg' : 'mt-auto',
                        )}
                        imageSize={50}
                        {...user}
                    />
                ))}
            </div>
        </section>
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
