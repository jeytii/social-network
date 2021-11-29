import { useRouter } from 'next/router';
import { HTMLAttributes, useEffect } from 'react';
import { QueryKey } from 'react-query';
import clsx from 'clsx';
import User from 'components/chunks/User';
import Spinner from 'components/vectors/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { UserPage } from 'types/page';
import { User as UserType } from 'types/user';

interface Props extends HTMLAttributes<HTMLElement> {
    queryKey: QueryKey;
    url: string;
    enabled?: boolean;
    cacheTime?: number;
}

export default function Users({
    queryKey,
    url,
    enabled,
    cacheTime,
    ...props
}: Props) {
    const { query } = useRouter();

    const {
        data,
        ref,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isSuccess,
        refetch,
        remove,
    } = useInfiniteScroll<UserType, UserPage, HTMLDivElement>(
        queryKey,
        { url, ...query },
        cacheTime as number,
        enabled,
    );

    useEffect(() => {
        if (!enabled) {
            remove();
            refetch();
        }
    }, [query]);

    if ((isLoading || isFetching) && !isFetchingNextPage) {
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
            <div>
                {data?.pages.map((user, i) => (
                    <User
                        key={user.slug}
                        ref={i === data.pages.length - 1 ? ref : null}
                        className={clsx(
                            'bg-skin-bg-contrast-light border border-skin-bg-contrast p-sm hover:bg-skin-bg-contrast',
                            i ? 'mt-lg' : 'mt-auto',
                        )}
                        imageSize={50}
                        {...user}
                    />
                ))}
            </div>

            {isFetchingNextPage && <Spinner className='mt-lg' />}
        </section>
    );
}

Users.defaultProps = {
    enabled: false,
    cacheTime: 1000 * 60 * 5,
};
