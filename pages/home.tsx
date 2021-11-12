import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { InfiniteData } from 'react-query';
import PostBox from 'components/chunks/PostBox';
import Spinner from 'components/vectors/Spinner';
import axios from 'config/axios';
import type { Post } from 'types/post';
import type { PostPage } from 'types/page';

interface OnSuccessEventData {
    status: number;
    data: Post;
}

const Posts = dynamic(() => import('components/layouts/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

export default function Home() {
    const onSuccessEvent = (
        current: InfiniteData<PostPage>,
        data: OnSuccessEventData,
    ) => {
        if (current) {
            current.pages[0].items.unshift(data.data);

            return current;
        }

        return {
            pageParams: [],
            pages: [
                {
                    items: [data.data],
                    has_more: false,
                    next_offset: null,
                    status: 200,
                },
            ],
        };
    };

    return (
        <div className='p-lg sm:px-md'>
            <PostBox
                rows={3}
                placeholder="What's on your mind?"
                buttonLabel='Post'
                value=''
                apiUrl='/api/posts'
                apiMethod='post'
                onSuccessEvent={onSuccessEvent}
            />
            <Posts />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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
                title: 'Home',
                isPrivate: true,
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
