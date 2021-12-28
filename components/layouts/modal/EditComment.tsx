import { useQueryClient, InfiniteData } from 'react-query';
import { MdClose } from 'react-icons/md';
import TextBox from 'components/utilities/TextBox';
import type { CommentPage } from 'types/page';
import type { ModifyItem } from 'types/item';
import type { User } from 'types/user';
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
    const user = queryClient.getQueryData<User>('user');
    const item = queryClient.getQueryData<ModifyItem>('edit');
    const queryKeys = [
        ['comments', item?.parentSlug],
        ['profile.comments', user?.slug],
        'profile.likes.comments',
    ];

    function onSuccess(_: never, { body }: { body: string }) {
        queryKeys.forEach(key => {
            if (queryClient.getQueryData(key)) {
                queryClient.setQueryData<QueryData>(key, current =>
                    update(current, item?.slug as string, body),
                );
            }
        });

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
            <header className='flex items-center border-b border-primary-transparent py-sm px-md'>
                <h1 className='text-md text-skin-secondary font-bold'>
                    Edit comment
                </h1>

                <button
                    type='button'
                    className='block rounded-full p-xs ml-auto'
                    onClick={closeModal}
                >
                    <MdClose
                        className='text-skin-primary'
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
