import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { QueryKey, UseInfiniteQueryOptions } from 'react-query';
import clsx from 'clsx';
import User from 'components/micro/User';
import Spinner from 'components/vectors/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { UserPage } from 'types/page';
import { User as UserType } from 'types/user';

interface Props extends UseInfiniteQueryOptions<UserPage, unknown, UserType> {
    className?: string;
    queryKey: QueryKey;
    url: string;
}

export default function Users({ className, url, enabled, ...props }: Props) {
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
    } = useInfiniteScroll({
        ...props,
        enabled,
        meta: { url, ...query },
        select: ({ pageParams, pages }) => ({
            pageParams,
            pages: pages.flatMap(page => [...page.items]),
        }),
    });

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
                <h1 className='text-md font-bold text-skin-primary opacity-50 text-center'>
                    No person to show.
                </h1>
            </section>
        );
    }

    return (
        <section className={className}>
            <div>
                {data?.pages.map((user, i) => (
                    <User
                        key={user.slug}
                        ref={i === data.pages.length - 1 ? ref : null}
                        className={clsx(
                            'bg-skin-main border border-skin-main p-md hover:border-primary-light',
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
    className: undefined,
};
