import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import Cookies from 'js-cookie';
import Spinner from 'components/vectors/Spinner';
import User from 'components/chunks/User';
import axios from 'config/axios';
import { UserPage } from 'types/page';
import { User as UserType } from 'types/user';
import { GetServerSideProps } from 'next';
import clsx from 'clsx';

async function getUsers({ pageParam = 0, meta }: QueryFunctionContext) {
    const { data } = await axios(Cookies.get('token')).get('/api/users', {
        params: {
            page: pageParam,
            ...meta,
        },
    });

    return data;
}

export default function Search() {
    const { query } = useRouter();
    const { data, refetch, isLoading, isSuccess } = useInfiniteQuery<
        UserPage,
        unknown,
        UserType
    >('users', getUsers, {
        enabled: false,
        meta: query,
        select: ({ pageParams, pages }) => ({
            pageParams,
            pages: pages.flatMap(page => [...page.items]),
        }),
    });

    useEffect(() => {
        refetch();
    }, [query]);

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-lg font-bold text-skin-text-light opacity-50 text-center'>
                    Something went wrong. Refresh the page to try again.
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
        await axios(req.cookies.token).get(`${process.env.APP_URL}/private`);

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
