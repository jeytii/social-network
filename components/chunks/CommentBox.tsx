import { KeyboardEvent } from 'react';
import { useMutation, useQueryClient, InfiniteData } from 'react-query';
import useTextBody from 'hooks/useTextBody';
import type { PostPage } from 'types/page';
import type { User } from 'types/user';
import type { Post } from 'types/post';

interface Variables {
    url: string;
    data: {
        post: string;
        body: string;
    };
}

export default function CommentBox({ slug }: { slug: string }) {
    const queryClient = useQueryClient();
    const [hook, checkTextBodyLength, charactersLeft] = useTextBody('');
    const { mutate, isLoading } = useMutation<unknown, unknown, Variables>(
        'create',
        { onSuccess },
    );

    const user = queryClient.getQueryData<User>('user');

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

    async function onSuccess() {
        await Promise.all([
            queryClient.cancelQueries(['comments', slug], { exact: true }),
            queryClient.cancelQueries(['profile.comments', user?.slug], {
                exact: true,
            }),
        ]);

        await Promise.all([
            queryClient.invalidateQueries(['comments', slug], {
                exact: true,
                refetchActive: true,
                refetchPage: () => true,
            }),
            queryClient.invalidateQueries(['profile.comments', user?.slug], {
                exact: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
        ]);

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
                    className='block bg-skin-main text-skin-primary text-md w-full py-sm px-md border border-skin-main rounded-full resize-none overflow-hidden disabled:opacity-7 disabled:text-skin-secondary disabled:cursor-not-allowed'
                    placeholder='Write a comment'
                    rows={1}
                    aria-label='Comment box'
                    disabled={isLoading}
                    onKeyPress={monitorKeyPress}
                    {...hook.register}
                />

                <input className='hidden' type='submit' />
            </form>

            <span className='w-[41px] h-[41px] flex items-center justify-center bg-skin-main text-primary-dark text-sm border border-skin-main rounded-full'>
                {charactersLeft}
            </span>
        </section>
    );
}
