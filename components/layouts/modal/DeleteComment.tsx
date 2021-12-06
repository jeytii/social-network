import { useQueryClient, useMutation } from 'react-query';
import { Dialog } from '@headlessui/react';
import type { CommentPage } from 'types/page';
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
        { key: ['comments', item?.parentSlug], path: '/post/[slug]' },
        { key: ['profile.comments', user?.slug], path: '/[username]' },
        { key: 'profile.likes.comments', path: '/likes' },
    ];

    function onSuccess() {
        queries.forEach(async query => {
            await queryClient.invalidateQueries<CommentPage>(query.key, {
                exact: true,
                refetchActive: true,
                refetchInactive: true,
                refetchPage: (page, index, allPages) => {
                    const comments = allPages.flatMap(p => [...p.items]);

                    return !!comments.find(
                        comment => comment.slug === item?.slug,
                    );
                },
            });
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
