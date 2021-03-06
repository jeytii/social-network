import { useQueryClient, useMutation, InfiniteData } from 'react-query';
import { Dialog } from '@headlessui/react';
import type { PostPage } from 'types/page';
import type { ModifyItem } from 'types/item';
import type { User } from 'types/user';
import Modal from '.';

interface Variables {
    url: string;
}

export default function DeleteCommentModal({ isOpen }: { isOpen: boolean }) {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>('user');
    const item = queryClient.getQueryData<ModifyItem>('delete');
    const { mutate, isLoading } = useMutation<unknown, unknown, Variables>(
        'delete',
        { onSuccess },
    );

    const postQueries = [
        'posts',
        ['profile.posts', user?.slug],
        'profile.likes.posts',
        'profile.bookmarks',
    ];

    async function onSuccess() {
        await Promise.all([
            queryClient.cancelQueries('profile.likes.comments'),
            queryClient.cancelQueries(['comments', item?.parentSlug], {
                exact: true,
            }),
            queryClient.cancelQueries(['profile.comments', user?.slug], {
                exact: true,
            }),
        ]);

        await Promise.all([
            queryClient.invalidateQueries('profile.likes.comments', {
                refetchActive: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
            queryClient.invalidateQueries(['comments', item?.parentSlug], {
                exact: true,
                refetchActive: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
            queryClient.invalidateQueries(['profile.comments', user?.slug], {
                exact: true,
                refetchActive: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
        ]);

        postQueries.forEach(query => {
            if (queryClient.getQueryData(query)) {
                queryClient.setQueryData<InfiniteData<PostPage> | undefined>(
                    query,
                    current => {
                        const posts = current?.pages.flatMap(page => [
                            ...page.items,
                        ]);

                        posts?.forEach(post => {
                            if (post.slug === item?.parentSlug) {
                                const p = post;

                                p.comments_count -= 1;
                            }
                        });

                        return current;
                    },
                );
            }
        });

        closeModal();
    }

    function deleteItem() {
        mutate({ url: `/api/comments/${item?.slug}` });
    }

    function closeModal() {
        queryClient.setQueryData('delete', null);
    }

    if (!item) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} closeEvent={closeModal}>
            <header className='bg-skin-main border-b border-skin-main p-md'>
                <Dialog.Title
                    as='h3'
                    className='text-md font-bold leading-6 text-skin-primary'
                >
                    Confirmation to delete comment
                </Dialog.Title>
            </header>

            <p className='paragraph-md text-skin-primary p-md'>
                Delete the selected comment?
            </p>

            <div className='bg-skin-main text-right border-t border-skin-main p-md'>
                <button
                    type='button'
                    className='button button-default px-sm'
                    disabled={isLoading}
                    onClick={closeModal}
                >
                    Cancel
                </button>

                <button
                    type='button'
                    className='button button-danger px-sm ml-md'
                    disabled={isLoading}
                    onClick={deleteItem}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
}
