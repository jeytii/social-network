import { useInfiniteQuery } from 'react-query';
import Comment from 'components/chunks/Comment';
import Spinner from 'components/vectors/Spinner';
import type { CommentPage } from 'types/page';
import type { Comment as CommentType } from 'types/comment';

export default function Comments({ postSlug }: { postSlug: string }) {
    const { data, isLoading, isSuccess } = useInfiniteQuery<
        CommentPage,
        unknown,
        CommentType
    >(['comments', postSlug], {
        meta: {
            url: '/api/comments',
            post: postSlug,
        },
        getNextPageParam: last => last.next_offset ?? false,
        select: result => {
            let pages: CommentType[] = [];

            if (result.pages.length === 1) {
                pages = result.pages[0].items;
            }

            if (result.pages.length > 1) {
                pages = result.pages.flatMap(page => [...page.items]);
            }

            return {
                pageParams: result.pageParams,
                pages,
            };
        },
        cacheTime: 1000 * 60 * 2,
    });

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md text-skin-text-light text-center'>
                    This post does not have any comment.
                </h1>
            </section>
        );
    }

    return (
        <section className='mt-lg'>
            {data?.pages.map(comment => (
                <Comment key={comment.slug} className='mt-lg' {...comment} />
            ))}
        </section>
    );
}
