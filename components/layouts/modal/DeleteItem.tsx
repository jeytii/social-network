import { useEffect } from 'react';
import {
    useQueryClient,
    useMutation,
    InfiniteData,
    QueryKey,
} from 'react-query';
import { Dialog } from '@headlessui/react';
import type { PostPage, CommentPage } from 'types/page';
import Modal from '.';

type SetQueryData = InfiniteData<PostPage | CommentPage> | undefined;

interface Variables {
    url: string;
}

interface DeleteItem {
    queryKey: QueryKey;
    slug: string;
    title: string;
    message: string;
    apiUrl: string;
}

export default function ConfirmDeletePostModal({
    isOpen,
}: {
    isOpen: boolean;
}) {
    const queryClient = useQueryClient();
    const item = queryClient.getQueryData<DeleteItem>('delete');
    const { mutate, isLoading } = useMutation<unknown, unknown, Variables>(
        'delete',
        { onSuccess },
    );

    function onSuccess() {
        if (item) {
            queryClient.setQueryData<SetQueryData>(item.queryKey, current => {
                current?.pages.forEach(page => {
                    const index = page.items.findIndex(
                        post => post.slug === item.slug,
                    );

                    if (index !== -1) {
                        page.items.splice(index, 1);
                    }
                });

                return current;
            });
        }

        closeModal();
    }

    function deleteItem() {
        if (item) {
            mutate({ url: item.apiUrl });
        }
    }

    function closeModal() {
        queryClient.setQueryData('delete', null);
    }

    useEffect(() => {
        return () => {
            queryClient.removeQueries('delete');
        };
    }, []);

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
                    {item.title}
                </Dialog.Title>
            </header>

            <p className='paragraph-md text-skin-text p-md bg-skin-bg-contrast'>
                {item.message}
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
