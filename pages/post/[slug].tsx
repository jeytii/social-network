import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useQuery, useQueryClient, QueryFunctionContext } from 'react-query';
import Post from 'components/chunks/post';
import CommentBox from 'components/chunks/CommentBox';
import Spinner from 'components/vectors/Spinner';
import axios from 'lib/axios';
import type { Post as PostType } from 'types/post';

const Comments = dynamic(() => import('components/layouts/Comments'), {
    loading: () => <Spinner className='mt-lg' />,
});

const getPost = async (ctx: QueryFunctionContext) => {
    try {
        const { data } = await axios().get(`/api/posts/${ctx.meta?.slug}`);

        return data.post;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error('Post does not exist.');
        }

        throw new Error('Something went wrong.');
    }
};

export default function ViewPost({ slug }: { slug: string }) {
    const queryClient = useQueryClient();
    const { data, isIdle, isError, error, remove } = useQuery<PostType, Error>(
        ['post', slug],
        getPost,
        { meta: { slug } },
    );

    useEffect(() => {
        return () => {
            remove();
            queryClient.removeQueries(['comments', slug]);
        };
    }, []);

    if (isIdle) {
        return <Spinner className='p-lg' />;
    }

    if (isError || !data) {
        return (
            <section className='p-lg'>
                <h1 className='text-md font-bold text-skin-secondary opacity-50 text-center'>
                    {error?.message}
                </h1>
            </section>
        );
    }

    return (
        <div className='p-lg sm:px-md'>
            <Post {...data} />

            <CommentBox slug={slug} />

            <Comments
                className='mt-lg'
                queryKey={['comments', slug]}
                url='/api/comments'
                slug={slug}
            />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    params,
    req,
}) => {
    const defaultReturn = {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };

    if (!req.cookies || !req.cookies.token) {
        return defaultReturn;
    }

    try {
        const responses = await Promise.all([
            axios(req.cookies.token).get('/private'),
            axios(req.cookies.token).get('/api/notifications/count'),
        ]);

        return {
            props: {
                title: 'Sosyal.me',
                isPrivate: true,
                user: responses[0].data.data,
                notificationsCount: responses[1].data.data,
                ...params,
            },
        };
    } catch (e) {
        return defaultReturn;
    }
};
