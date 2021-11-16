import { Fragment } from 'react';
import { useInfiniteQuery, QueryFunctionContext } from 'react-query';
import Cookies from 'js-cookie';
import Comment from 'components/chunks/Comment';
import Spinner from 'components/vectors/Spinner';
import axios from 'config/axios';
import type { CommentPage } from 'types/page';

const getComments = (slug: string) => async (ctx: QueryFunctionContext) => {
    const { data } = await axios(Cookies.get('token')).get('/api/comments', {
        params: {
            page: ctx.pageParam || 1,
            pid: slug,
        },
    });

    return data;
};

export default function Comments({ postSlug }: { postSlug: string }) {
    const { data, isLoading, isSuccess } = useInfiniteQuery<CommentPage>(
        ['comments', postSlug],
        getComments(postSlug),
        {
            getNextPageParam: last => (last.has_more ? last.next_offset : null),
        },
    );

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages[0].items.length) {
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
            {data?.pages.map(page => (
                <Fragment key={page.next_offset}>
                    {page.items.map(comment => (
                        <Comment
                            key={comment.slug}
                            className='mt-lg'
                            {...comment}
                        />
                    ))}
                </Fragment>
            ))}
        </section>
    );
}
