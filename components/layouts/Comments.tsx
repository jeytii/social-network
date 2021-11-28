import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { useInfiniteQuery, InfiniteData, QueryKey } from 'react-query';
import Comment from 'components/chunks/Comment';
import Spinner from 'components/vectors/Spinner';
import type { CommentPage } from 'types/page';
import type { Comment as CommentType } from 'types/comment';
import clsx from 'clsx';

interface Props extends HTMLAttributes<HTMLElement> {
    queryKey: QueryKey;
    url: string;
    slug?: string;
    hasLink?: boolean;
    cacheTime?: number;
}

const formatData = ({ pageParams, pages }: InfiniteData<CommentPage>) => {
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

export default function Comments({
    queryKey,
    url,
    slug,
    hasLink,
    cacheTime,
    ...props
}: Props) {
    const meta = slug ? { url, post: slug } : { url };
    const { data, isLoading, isSuccess } = useInfiniteQuery<
        CommentPage,
        unknown,
        CommentType
    >(queryKey, {
        meta,
        getNextPageParam: last => last.next_offset ?? false,
        select: formatData,
        cacheTime,
    });

    if (isLoading || !data) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md text-skin-text-light text-center'>
                    No comments to show.
                </h1>
            </section>
        );
    }

    return (
        <section {...props}>
            {data.pages.map((comment, index) => {
                if (hasLink) {
                    return (
                        <Link href={`/post/${comment.post_slug}`}>
                            <Comment
                                key={comment.slug}
                                className={clsx(
                                    'cursor-pointer',
                                    !!index && 'mt-lg',
                                )}
                                {...comment}
                            />
                        </Link>
                    );
                }

                return (
                    <Comment
                        key={comment.slug}
                        className={index ? 'mt-lg' : ''}
                        {...comment}
                    />
                );
            })}
        </section>
    );
}

Comments.defaultProps = {
    slug: undefined,
    hasLink: false,
    cacheTime: 1000 * 60 * 5,
};
