import { useRouter } from 'next/router';
import { HTMLAttributes, useEffect } from 'react';
import { useInfiniteQuery, InfiniteData, QueryKey } from 'react-query';
import clsx from 'clsx';
import User from 'components/chunks/User';
import Spinner from 'components/vectors/Spinner';
import { UserPage } from 'types/page';
import { User as UserType } from 'types/user';

interface Props extends HTMLAttributes<HTMLElement> {
    queryKey: QueryKey;
    url: string;
    enabled?: boolean;
    cacheTime?: number;
}

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

export default function Users({
    queryKey,
    url,
    enabled,
    cacheTime,
    ...props
}: Props) {
    const { query } = useRouter();
    const { data, refetch, isLoading, isFetching, isSuccess } =
        useInfiniteQuery<UserPage, unknown, UserType>(queryKey, {
            enabled,
            meta: { url, ...query },
            select: formatData,
            cacheTime,
        });

    useEffect(() => {
        if (!enabled) {
            refetch();
        }
    }, [query]);

    if (isLoading || isFetching) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md font-bold text-skin-text-light opacity-50 text-center'>
                    No person to show.
                </h1>
            </section>
        );
    }

    return (
        <section {...props}>
            {data?.pages.map((user, index) => (
                <User
                    key={user.slug}
                    className={clsx(
                        'bg-skin-bg-contrast-light border border-skin-bg-contrast p-sm hover:bg-skin-bg-contrast',
                        index ? 'mt-lg' : 'mt-auto',
                    )}
                    imageSize={50}
                    {...user}
                />
            ))}
        </section>
    );
}

Users.defaultProps = {
    enabled: false,
    cacheTime: 1000 * 60 * 5,
};
