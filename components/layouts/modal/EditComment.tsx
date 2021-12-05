import { useQueryClient, InfiniteData } from 'react-query';
import { MdClose } from 'react-icons/md';
import TextBox from 'components/utilities/TextBox';
import type { CommentPage } from 'types/page';
import type { ModifyItem } from 'types/item';
import Modal from '.';

type QueryData = InfiniteData<CommentPage> | undefined;

const update = (current: QueryData, slug: string, body: string): QueryData => {
    const comments = current?.pages.flatMap(page => [...page.items]);

    comments?.forEach(comment => {
        if (comment.slug === slug) {
            const c = comment;

            c.body = body;
            c.is_edited = true;
        }
    });

    return current;
};

export default function EditCommentModal({ isOpen }: { isOpen: boolean }) {
    const queryClient = useQueryClient();
    const item = queryClient.getQueryData<ModifyItem>('edit');

    function onSuccess(_: never, { body }: { body: string }) {
        if (queryClient.getQueryData('comments', { exact: false })) {
            queryClient.setQueryData<QueryData>('comments', current =>
                update(current, item?.slug as string, body),
            );
        }

        if (queryClient.getQueryData('profile.likes.comments')) {
            queryClient.setQueryData<QueryData>(
                'profile.likes.comments',
                current => update(current, item?.slug as string, body),
            );
        }

        if (queryClient.getQueryData('profile.comments', { exact: false })) {
            queryClient.setQueryData<QueryData>('profile.comments', current =>
                update(current, item?.slug as string, body),
            );
        }

        closeModal();
    }

    function closeModal() {
        queryClient.setQueryData('edit', null);
    }

    if (!item) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} closeEvent={closeModal}>
            <header className='flex items-center py-sm px-md'>
                <h1 className='text-md text-skin-text-light font-bold'>
                    Edit comment
                </h1>

                <button
                    type='button'
                    className='block rounded-full p-xs ml-auto hover:bg-skin-bg-contrast'
                    onClick={closeModal}
                >
                    <MdClose
                        className='text-skin-text'
                        size={20}
                        viewBox='2 2 20 20'
                    />
                </button>
            </header>

            <TextBox
                buttonLabel='Edit comment'
                value={item.value}
                apiUrl={`/api/comments/${item.slug}`}
                apiMethod='put'
                onSuccess={onSuccess}
            />
        </Modal>
    );
}
