import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { InfiniteData, useQueryClient } from 'react-query';
import TextBox from 'components/utilities/TextBox';
import Spinner from 'components/vectors/Spinner';
import axios from 'config/axios';
import type { Post } from 'types/post';
import type { PostPage } from 'types/page';

interface SuccessEventData {
    data: {
        status: number;
        data: Post;
    };
}

const Posts = dynamic(() => import('components/layouts/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

export default function Home() {
    const queryClient = useQueryClient();

    const successEvent = ({ data }: SuccessEventData) => {
        queryClient.setQueryData<InfiniteData<PostPage> | undefined>(
            'posts',
            current => {
                if (current) {
                    current.pages[0].items.unshift(data.data);

                    return current;
                }

                return current;
            },
        );
    };

    return (
        <div className='p-lg sm:px-md'>
            <TextBox
                placeholder="What's on your mind?"
                buttonLabel='Post'
                value=''
                apiUrl='/api/posts'
                apiMethod='post'
                successEvent={successEvent}
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
