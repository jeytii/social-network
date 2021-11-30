import { KeyboardEvent } from 'react';
import { useMutation, useQueryClient, InfiniteData } from 'react-query';
import useTextBody from 'hooks/useTextBody';
import type { CommentPage } from 'types/page';
import type { User } from 'types/user';
import type { Post } from 'types/post';
import type { Comment } from 'types/comment';

interface Variables {
    url: string;
    data: {
        post: string;
        body: string;
    };
}

interface ResponseBody {
    data: {
        status: number;
        data: Comment;
    };
}

export default function CommentBox({ slug }: { slug: string }) {
    const queryClient = useQueryClient();
    const [hook, checkTextBodyLength, charactersLeft] = useTextBody('');
    const { mutate, isLoading } = useMutation<ResponseBody, unknown, Variables>(
        'create',
        { onSuccess },
    );

    function monitorKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            if (hook.values.body.length) {
                mutate({
                    url: '/api/comments',
                    data: { post: slug, ...hook.values },
                });
            } else {
                event.preventDefault();
            }
        } else {
            checkTextBodyLength(event);
        }
    }

    async function onSuccess({ data }: ResponseBody) {
        const user = queryClient.getQueryData<User>('user');

        // Update the number of comments of the currently previewed post.
        queryClient.setQueryData<Post | undefined>(['post', slug], current => {
            if (!current) {
                return undefined;
            }

            return { ...current, comments_count: current.comments_count + 1 };
        });

        // Create a comment.
        queryClient.setQueryData<InfiniteData<CommentPage> | undefined>(
            ['comments', slug],
            current => {
                current?.pages[0].items.unshift(data.data);

                return current;
            },
        );

        // Add the comment to profile's list of comments.
        queryClient.setQueryData<InfiniteData<CommentPage> | undefined>(
            ['profile.comemnts', user?.slug],
            current => {
                if (!current) {
                    return undefined;
                }

                current?.pages[0].items.unshift(data.data);

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
