import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { QueryKey } from 'react-query';
import clsx from 'clsx';
import Comment from 'components/chunks/Comment';
import Spinner from 'components/vectors/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import type { CommentPage } from 'types/page';
import type { Comment as CommentType } from 'types/comment';

interface Props extends HTMLAttributes<HTMLElement> {
    queryKey: QueryKey;
    url: string;
    slug?: string;
    hasLink?: boolean;
    cacheTime?: number;
}

export default function Comments({
    queryKey,
    url,
    slug,
    hasLink,
    cacheTime,
    ...props
}: Props) {
    const meta = slug ? { url, post: slug } : { url };
    const { data, ref, isLoading, isFetchingNextPage, isSuccess } =
        useInfiniteScroll<CommentType, CommentPage>(
            queryKey,
            meta,
            cacheTime as number,
        );

    if (isLoading || !data) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md font-bold text-skin-text-light opacity-50 text-center'>
                    No comment to show.
                </h1>
            </section>
        );
    }

    return (
        <section {...props}>
            <div>
                {data.pages.map((comment, i) =>
                    hasLink ? (
                        <Link
                            key={comment.slug}
                            href={`/post/${comment.post_slug}`}
                        >
                            <Comment
                                ref={i === data.pages.length - 1 ? ref : null}
                                className={clsx('cursor-pointer', i && 'mt-lg')}
                                {...comment}
                            />
                        </Link>
                    ) : (
                        <Comment
                            key={comment.slug}
                            ref={i === data.pages.length - 1 ? ref : null}
                            className={i ? 'mt-lg' : ''}
                            {...comment}
                        />
                    ),
                )}
            </div>

            {isFetchingNextPage && <Spinner className='mt-lg' />}
        </section>
    );
}

Comments.defaultProps = {
    slug: undefined,
    hasLink: false,
    cacheTime: 1000 * 60 * 5,
};
