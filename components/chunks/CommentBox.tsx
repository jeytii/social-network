import { KeyboardEvent } from 'react';
import { useMutation, useQueryClient, InfiniteData } from 'react-query';
import Cookies from 'js-cookie';
import useTextBody from 'hooks/useTextBody';
import axios from 'config/axios';
import type { Post } from 'types/post';
import type { Comment } from 'types/comment';
import type { PostPage, CommentPage } from 'types/page';

interface ResponseBody {
    status: number;
    data: Comment;
}

const authToken = Cookies.get('token');

export default function CommentBox({ postSlug }: { postSlug: string }) {
    const queryClient = useQueryClient();
    const [hook, checkTextBodyLength, charactersLeft] = useTextBody('');
    const newComment = {
        post: postSlug,
        ...hook.values,
    };

    const { mutate, isLoading } = useMutation<{ data: ResponseBody }>(
        () => axios(authToken).post('/api/comments', newComment),
        { onSuccess, retry: 3 },
    );

    function monitorKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            if (hook.values.body.length) {
                mutate();
            } else {
                event.preventDefault();
            }
        } else {
            checkTextBodyLength(event);
        }
    }

    function onSuccess({ data }: { data: ResponseBody }) {
        // Create a comment.
        queryClient.setQueryData<InfiniteData<CommentPage> | undefined>(
            ['comments', postSlug],
            current => {
                if (current) {
                    current.pages[0].items.unshift(data.data);

                    return current;
                }

                return current;
            },
        );

        // Update the number of comments of the current post in news feed.
        queryClient.setQueryData<InfiniteData<PostPage> | undefined>(
            'posts',
            current => {
                current?.pages.forEach(page => {
                    const post = page.items.find(i => i.slug === postSlug);

                    if (post) {
                        post.comments_count += 1;
                    }
                });

                return current;
            },
        );

        // Update the number of comments of the current previewed post.
        queryClient.setQueryData<Post | undefined>(
            ['post', postSlug],
            current => {
                if (current) {
                    const { comments_count, ...postData } = current;

                    return {
                        ...postData,
                        comments_count: comments_count + 1,
                    };
                }

                return current;
            },
        );

        hook.resetValue();
    }

    return (
        <section className='flex gap-sm items-start mt-lg'>
            <form className='flex-1'>
                <textarea
                    className='block bg-skin-bg-contrast text-skin-text text-md w-full py-sm px-md border border-skin-bg-contrast rounded-3xl resize-none overflow-hidden disabled:opacity-7 disabled:text-skin-text-light disabled:cursor-not-allowed'
                    placeholder='Write a comment'
                    rows={1}
                    aria-label='Comment box'
                    disabled={isLoading}
                    onKeyPress={monitorKeyPress}
                    {...hook.register}
                />

                <input className='hidden' type='submit' />
            </form>

            <span className='w-[44px] h-[44px] flex items-center justify-center bg-skin-bg-contrast text-primary text-sm px-sm rounded-full'>
                {charactersLeft}
            </span>
        </section>
    );
}
