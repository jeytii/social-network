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
            <header className='bg-skin-main border-b border-skin-main p-md'>
                <Dialog.Title
                    as='h3'
                    className='text-md font-bold text-skin-secondary'
                >
                    Confirmation
                </Dialog.Title>
            </header>

            <p className='paragraph-md text-skin-primary p-md'>
                Are you sure you want to delete the selected post?
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
