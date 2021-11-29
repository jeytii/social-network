import { useRouter } from 'next/router';
import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { QueryKey } from 'react-query';
import clsx from 'clsx';
import Post from 'components/chunks/post';
import Spinner from 'components/vectors/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import type { PostPage } from 'types/page';
import type { Post as PostType } from 'types/post';

interface Props extends HTMLAttributes<HTMLElement> {
    queryKey: QueryKey;
    url: string;
    cacheTime?: number;
}

export default function Posts({ queryKey, url, cacheTime, ...props }: Props) {
    const { query } = useRouter();
    const { data, ref, isLoading, isFetchingNextPage, isSuccess } =
        useInfiniteScroll<PostType, PostPage>(
            queryKey,
            { url, ...query },
            cacheTime as number,
        );

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md font-bold text-skin-text-light opacity-50 text-center'>
                    No post to show.
                </h1>
            </section>
        );
    }

    return (
        <section {...props}>
            <div>
                {data?.pages.map((post, i) => (
                    <Link key={post.slug} href={`/post/${post.slug}`}>
                        <Post
                            ref={i === data.pages.length - 1 ? ref : null}
                            className={clsx('cursor-pointer', i && 'mt-lg')}
                            {...post}
                        />
                    </Link>
                ))}
            </div>

            {isFetchingNextPage && <Spinner className='mt-lg' />}
        </section>
    );
}

Posts.defaultProps = {
    cacheTime: 1000 * 60 * 5,
};
