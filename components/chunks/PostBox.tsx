import { InfiniteData, useMutation, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import useTextBody from 'hooks/useTextBodyLength';
import axios from 'config/axios';
import type { PostPage } from 'types/page';
import type { Post } from 'types/post';

interface Variables {
    body: string;
}

interface ResponseBody {
    data: {
        status: number;
        data: Post;
    };
}

export default function PostBox() {
    const [hook, checkTextBodyLength, charactersLeft] = useTextBody();

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation<ResponseBody, unknown, Variables>(
        newPost => axios(Cookies.get('token')).post('/api/posts', newPost),
        {
            onSuccess,
            retry: 3,
        },
    );

    function onSuccess({ data }: ResponseBody) {
        queryClient.setQueryData<{
            pageParams: unknown[];
            pages: PostPage[];
        }>('posts', (current): InfiniteData<PostPage> => {
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
        });

        hook.resetValue();
    }

    function submit() {
        mutate(hook.values);
    }

    return (
        <form className='rounded-md bg-skin-bg-contrast'>
            <textarea
                className='text-skin-text w-full transparent resize-none rounded-t-md p-md disabled:opacity-50 disabled:cursor-not-allowed'
                placeholder="What's on you mind?"
                rows={3}
                disabled={isLoading}
                onKeyPress={checkTextBodyLength}
                {...hook.register}
            />

            <div className='flex items-center py-sm px-md bg-skin-bg-contrast-light rounded-b-md'>
                <span
                    className='text-sm text-primary'
                    aria-label='Characters left'
                >
                    {charactersLeft}
                </span>
                <button
                    className='btn-primary rounded-full ml-auto py-xs px-lg'
                    type='button'
                    disabled={isLoading || charactersLeft === 300}
                    onClick={submit}
                >
                    Post
                </button>
            </div>
        </form>
    );
}
