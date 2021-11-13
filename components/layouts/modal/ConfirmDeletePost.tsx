import { useEffect } from 'react';
import {
    useQueryClient,
    InfiniteData,
    useMutation,
    QueryClient,
} from 'react-query';
import { Dialog } from '@headlessui/react';
import Cookies from 'js-cookie';
import axios from 'config/axios';
import type { PostPage } from 'types/page';
import Modal from '.';

const token = Cookies.get('token');
const mutationFn = (post?: string) => axios(token).delete(`/api/posts/${post}`);

function successfulDelete(queryClient: QueryClient, slug?: string) {
    queryClient.setQueryData<InfiniteData<PostPage> | undefined>(
        'posts',
        current => {
            current?.pages.forEach(page => {
                const index = page.items.findIndex(post => post.slug === slug);

                if (index !== -1) {
                    page.items.splice(index, 1);
                }
            });

            return current;
        },
    );

    queryClient.setQueryData('showDeletePostModal', false);
    queryClient.removeQueries('delete.post');
}

export default function ConfirmDeletePostModal({
    isOpen,
}: {
    isOpen: boolean;
}) {
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation<
        unknown,
        unknown,
        string | undefined
    >(mutationFn, {
        onSuccess(response, slug) {
            successfulDelete(queryClient, slug);
        },
        retry: 3,
    });

    const deletePost = () => {
        mutate(queryClient.getQueryData<string>('delete.post'));
    };

    const closeModal = () => {
        queryClient.setQueryData('showDeletePostModal', false);
    };

    useEffect(() => {
        return () => {
            queryClient.removeQueries('delete.post');
        };
    }, []);

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
                Are you sure you want to delete the selected post?
            </p>

            <div className='p-md'>
                <button
                    type='button'
                    className='btn-danger text-md py-xs px-sm'
                    disabled={isLoading}
                    onClick={deletePost}
                >
                    Delete
                </button>

                <button
                    type='button'
                    className='text-md text-skin-text-light rounded-md py-xs px-sm ml-md hover:text-skin-text'
                    disabled={isLoading}
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}
