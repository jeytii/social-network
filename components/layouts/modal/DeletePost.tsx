import { useQueryClient, useMutation, InfiniteData } from 'react-query';
import { Dialog } from '@headlessui/react';
import type { ModifyItem } from 'types/item';
import { PostPage } from 'types/page';
import { useRouter } from 'next/router';
import Modal from '.';

interface Variables {
    url: string;
}

export default function DeletePostModal({ isOpen }: { isOpen: boolean }) {
    const { route } = useRouter();
    const queryClient = useQueryClient();
    const item = queryClient.getQueryData<ModifyItem>('delete');
    const { mutate, isLoading } = useMutation<unknown, unknown, Variables>(
        'delete',
        { onSuccess },
    );

    const queries = [
        { key: 'posts', path: '/home' },
        { key: ['profile.posts', item?.parentSlug], path: '/[username]' },
        { key: 'profile.likes.posts', path: '/likes' },
        { key: 'profile.bookmarks', path: '/bookmarks' },
    ];

    function onSuccess() {
        queries.forEach(async query => {
            if (queryClient.getQueryData(query.key)) {
                if (route === query.path) {
                    queryClient.setQueryData<
                        InfiniteData<PostPage> | undefined
                    >(query.key, current => {
                        current?.pages.forEach(page => {
                            const index = page.items.findIndex(
                                post => post.slug === item?.slug,
                            );

                            if (index !== -1) {
                                page.items.splice(index, 1);
                            }
                        });

                        return current;
                    });
                } else {
                    await queryClient.invalidateQueries(query.key, {
                        exact: true,
                        refetchActive: true,
                        refetchInactive: true,
                    });
                }
            }
        });

        closeModal();
    }

    function deleteItem() {
        mutate({ url: `/api/posts/${item?.slug}` });
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
                    Confirmation to delete post
                </Dialog.Title>
            </header>

            <p className='paragraph-md text-skin-text p-md bg-skin-bg-contrast'>
                Delete the selected post?
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
