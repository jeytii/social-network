import { useQueryClient, useMutation } from 'react-query';
import { Dialog } from '@headlessui/react';
import type { ModifyItem } from 'types/item';
import Modal from '.';

interface Variables {
    url: string;
}

export default function DeletePostModal({ isOpen }: { isOpen: boolean }) {
    const queryClient = useQueryClient();
    const item = queryClient.getQueryData<ModifyItem>('delete');
    const { mutate, isLoading } = useMutation<unknown, unknown, Variables>(
        'delete',
        { onSuccess },
    );

    async function onSuccess() {
        await Promise.all([
            queryClient.cancelQueries('posts'),
            queryClient.cancelQueries('profile.likes.posts'),
            queryClient.cancelQueries('profile.bookmarks'),
            queryClient.cancelQueries(['profile.posts', item?.parentSlug], {
                exact: true,
            }),
        ]);

        await Promise.all([
            queryClient.invalidateQueries('posts', {
                refetchActive: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
            queryClient.invalidateQueries('profile.likes.posts', {
                refetchActive: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
            queryClient.invalidateQueries('profile.bookmarks', {
                refetchActive: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
            queryClient.invalidateQueries(['profile.posts', item?.parentSlug], {
                exact: true,
                refetchActive: true,
                refetchInactive: true,
                refetchPage: () => true,
            }),
        ]);

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
