import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useQuery, useQueryClient, QueryFunctionContext } from 'react-query';
import Post from 'components/chunks/post';
import Comments from 'components/layouts/Comments';
import CommentBox from 'components/chunks/CommentBox';
import Spinner from 'components/vectors/Spinner';
import { axiosClient, axiosServer } from 'config/axios';
import type { Post as PostType } from 'types/post';

const getPost = async (ctx: QueryFunctionContext) => {
    try {
        const { data } = await axiosClient().get(
            `/api/posts/${ctx.meta?.slug}`,
        );

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
    const { data, isIdle, isError, error } = useQuery<PostType, Error>(
        ['post', slug],
        getPost,
        {
            enabled: queryClient.getQueryData(['post', slug]) === undefined,
            meta: { slug },
            cacheTime: 1000 * 60 * 2,
        },
    );

    useEffect(() => {
        return () => {
            queryClient.removeQueries(['post', slug]);
            queryClient.removeQueries(['comments', slug]);
        };
    }, []);

    if (isIdle) {
        return <Spinner className='p-lg' />;
    }

    if (isError || !data) {
        return (
            <h1 className='text-md text-skin-text-light text-center p-lg'>
                {error?.message}
            </h1>
        );
    }

    return (
        <div className='p-lg sm:px-md'>
            <Post {...data} />

            <CommentBox slug={slug} />

            <Comments
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
    if (!req.cookies || !req.cookies.token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        await axiosServer(req.cookies.token).get('/private');

        return {
            props: {
                title: 'Sosyal.me',
                isPrivate: true,
                ...params,
            },
        };
    } catch (e) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};
