import { KeyboardEvent } from 'react';
import { useMutation, useQueryClient, InfiniteData } from 'react-query';
import useTextBody from 'hooks/useTextBody';
import type { CommentPage, PostPage } from 'types/page';
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

    const user = queryClient.getQueryData<User>('user');

    const queries = [
        ['comments', slug],
        ['profile.comments', user?.slug],
    ];

    const postQueries = [
        'posts',
        ['profile.posts', user?.slug],
        'profile.likes.posts',
        'profile.bookmarks',
    ];

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
        await queryClient.cancelQueries(['comments', slug], { exact: true });

        queries.forEach(query => {
            if (queryClient.getQueryData(query)) {
                queryClient.setQueryData<InfiniteData<CommentPage> | undefined>(
                    query,
                    current => {
                        current?.pages[0].items.unshift(data.data);

                        return current;
                    },
                );
            }
        });

        queryClient.setQueryData<Post | undefined>(['post', slug], current => {
            if (!current) {
                return undefined;
            }

            return { ...current, comments_count: current.comments_count + 1 };
        });

        postQueries.forEach(query => {
            if (queryClient.getQueryData(query)) {
                queryClient.setQueryData<InfiniteData<PostPage> | undefined>(
                    query,
                    current => {
                        const posts = current?.pages.flatMap(page => [
                            ...page.items,
                        ]);

                        posts?.forEach(post => {
                            if (post.slug === slug) {
                                const p = post;

                                p.comments_count += 1;
                            }
                        });

                        return current;
                    },
                );
            }
        });

        hook.resetValue();
    }

    return (
        <section className='flex gap-sm items-start mt-lg'>
            <form className='flex-1'>
                <textarea
                    className='block bg-skin-main text-skin-primary text-md w-full py-sm px-md border border-primary-light rounded-full resize-none overflow-hidden disabled:opacity-7 disabled:text-skin-secondary disabled:cursor-not-allowed'
                    placeholder='Write a comment'
                    rows={1}
                    aria-label='Comment box'
                    disabled={isLoading}
                    onKeyPress={monitorKeyPress}
                    {...hook.register}
                />

                <input className='hidden' type='submit' />
            </form>

            <span className='w-[41px] h-[41px] flex items-center justify-center bg-skin-main text-primary-dark text-sm rounded-full'>
                {charactersLeft}
            </span>
        </section>
    );
}
