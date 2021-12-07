import { useQueryClient, useMutation, InfiniteData } from 'react-query';
import { Dialog } from '@headlessui/react';
import type { CommentPage, PostPage } from 'types/page';
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

    const queries = [
        ['comments', item?.parentSlug],
        ['profile.comments', user?.slug],
        'profile.likes.comments',
    ];

    const postQueries = [
        'posts',
        ['profile.posts', user?.slug],
        'profile.likes.posts',
        'profile.bookmarks',
    ];

    async function onSuccess() {
        queries.forEach(query => {
            queryClient.setQueryData<InfiniteData<CommentPage> | undefined>(
                query,
                current => {
                    current?.pages.forEach(page => {
                        const index = page.items.findIndex(
                            comment => comment.slug === item?.slug,
                        );

                        if (index !== -1) {
                            page.items.splice(index, 1);
                        }
                    });

                    return current;
                },
            );
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
            <header className='p-md'>
                <Dialog.Title
                    as='h3'
                    className='text-md font-bold leading-6 text-skin-text'
                >
                    Confirmation to delete comment
                </Dialog.Title>
            </header>

            <p className='paragraph-md text-skin-text p-md bg-skin-bg-contrast'>
                Delete the selected comment?
            </p>

            <div className='p-md'>
                <button
                    type='button'
                    className='button button-danger px-sm'
                    disabled={isLoading}
                    onClick={deleteItem}
                >
                    Delete
                </button>

                <button
                    type='button'
                    className='button button-default px-sm ml-md'
                    disabled={isLoading}
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}
