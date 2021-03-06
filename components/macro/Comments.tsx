import Link from 'next/link';
import { QueryKey, UseInfiniteQueryOptions } from 'react-query';
import clsx from 'clsx';
import Comment from 'components/micro/Comment';
import Spinner from 'components/utilities/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import type { CommentPage } from 'types/page';
import type { Comment as CommentType } from 'types/comment';

interface Props
    extends UseInfiniteQueryOptions<CommentPage, unknown, CommentType> {
    className?: string;
    queryKey: QueryKey;
    url: string;
    slug?: string;
    hasLink?: boolean;
}

export default function Comments({
    className,
    url,
    slug,
    hasLink,
    ...props
}: Props) {
    const meta = slug ? { url, post: slug } : { url };
    const { data, ref, isLoading, isFetchingNextPage, isSuccess } =
        useInfiniteScroll({
            ...props,
            meta,
            select: ({ pageParams, pages }) => ({
                pageParams,
                pages: pages.flatMap(page => [...page.items]),
            }),
        });

    if (isLoading || !data) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md font-bold text-skin-primary opacity-50 text-center'>
                    No comment to show.
                </h1>
            </section>
        );
    }

    return (
        <section className={className}>
            <div>
                {data.pages.map((comment, i) =>
                    hasLink ? (
                        <Link
                            key={comment.unique_key}
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
                            key={comment.unique_key}
                            ref={i === data.pages.length - 1 ? ref : null}
                            className={clsx(!!i && 'mt-lg')}
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
    className: undefined,
    slug: undefined,
    hasLink: false,
};
