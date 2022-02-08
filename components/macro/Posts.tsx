import { useRouter } from 'next/router';
import Link from 'next/link';
import { QueryKey, UseInfiniteQueryOptions } from 'react-query';
import clsx from 'clsx';
import Post from 'components/chunks/post';
import Spinner from 'components/vectors/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import type { PostPage } from 'types/page';
import type { Post as PostType } from 'types/post';

interface Props extends UseInfiniteQueryOptions<PostPage, unknown, PostType> {
    className?: string;
    queryKey: QueryKey;
    url: string;
}

export default function Posts({ className, url, ...props }: Props) {
    const { query } = useRouter();
    const { data, ref, isLoading, isFetchingNextPage, isSuccess } =
        useInfiniteScroll({
            ...props,
            meta: { url, ...query },
            select: ({ pageParams, pages }) => ({
                pageParams,
                pages: pages.flatMap(page => [...page.items]),
            }),
        });

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md font-bold text-skin-primary opacity-50 text-center'>
                    No post to show.
                </h1>
            </section>
        );
    }

    return (
        <section className={className}>
            <div>
                {data?.pages.map((post, i) => (
                    <Link key={post.key} href={`/post/${post.slug}`}>
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
    className: undefined,
};
