import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect } from 'react';
import { InfiniteData, QueryKey, useInfiniteQuery } from 'react-query';
import clsx from 'clsx';
import Post from 'components/chunks/post';
import Spinner from 'components/vectors/Spinner';
import type { PostPage } from 'types/page';
import type { Post as PostType } from 'types/post';

interface Props {
    queryKey: QueryKey;
    url: string;
    enabled?: boolean;
    cacheTime?: number;
}

const formatData = ({ pageParams, pages }: InfiniteData<PostPage>) => {
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

function Posts({ queryKey, url, enabled, cacheTime }: Props) {
    const { query } = useRouter();
    const { data, isLoading, isIdle, isSuccess, refetch } = useInfiniteQuery<
        PostPage,
        unknown,
        PostType
    >(queryKey, {
        enabled,
        meta: { url, ...query },
        getNextPageParam: last => last.next_offset ?? false,
        select: formatData,
        cacheTime,
    });

    useEffect(() => {
        if (!enabled) {
            refetch();
        }
    }, [query]);

    if (isLoading || isIdle || !data) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md text-skin-text-light text-center'>
                    No posts to show.
                </h1>
            </section>
        );
    }

    return (
        <section className='p-lg sm:px-md'>
            {data.pages.map((post, index) => (
                <Link key={post.slug} href={`/post/${post.slug}`}>
                    <Post
                        className={clsx('cursor-pointer', !!index && 'mt-lg')}
                        {...post}
                    />
                </Link>
            ))}
        </section>
    );
}

Posts.defaultProps = {
    enabled: false,
    cacheTime: 1000 * 60 * 5,
};

export default Posts;
