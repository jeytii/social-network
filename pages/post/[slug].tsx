import { GetServerSideProps } from 'next';
import { useQuery, QueryClient, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import Post from 'components/chunks/post';
import Comments from 'components/layouts/Comments';
import CommentBox from 'components/chunks/CommentBox';
import Spinner from 'components/vectors/Spinner';
import axios from 'config/axios';
import type { Post as PostType } from 'types/post';

const getPost = (queryClient: QueryClient, slug: string) => async () => {
    const post = queryClient.getQueryData<PostType>(['post', slug]);

    if (post) {
        return post;
    }

    try {
        const { data } = await axios(Cookies.get('token')).get(
            `/api/posts/${slug}`,
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
    const { data, isLoading, isError, error } = useQuery<PostType, Error>(
        ['post', slug],
        getPost(queryClient, slug),
        {
            cacheTime: 1000 * 60 * 2,
        },
    );

    if (isLoading) {
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

            <CommentBox postSlug={slug} />

            <Comments postSlug={slug} />
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
        await axios(req.cookies.token).get(`${process.env.APP_URL}/private`);

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
