import { useQueryClient, InfiniteData } from 'react-query';
import { MdClose } from 'react-icons/md';
import TextBox from 'components/utilities/TextBox';
import type { PostPage } from 'types/page';
import type { ModifyItem } from 'types/item';
import type { User } from 'types/user';
import Modal from '.';

type QueryData = InfiniteData<PostPage> | undefined;

const update = (current: QueryData, slug: string, body: string): QueryData => {
    const posts = current?.pages.flatMap(page => [...page.items]);

    posts?.forEach(post => {
        if (post.slug === slug) {
            const p = post;

            p.body = body;
            p.is_edited = true;
        }
    });

    return current;
};

export default function EditPostModal({ isOpen }: { isOpen: boolean }) {
    const queryClient = useQueryClient();
    const item = queryClient.getQueryData<ModifyItem>('edit');
    const user = queryClient.getQueryData<User>('user');
    const queryKeys = [
        'posts',
        ['profile.posts', user?.slug],
        'profile.likes.posts',
        'profile.bookmarks',
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
            <header className='flex items-center bg-skin-main border-b border-skin-main py-sm px-md'>
                <h1 className='text-md text-skin-secondary font-bold'>
                    Edit post
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
                className='border-none rounded-[0px]'
                buttonLabel='Edit'
                value={item.value}
                apiUrl={`/api/posts/${item.slug}`}
                apiMethod='put'
                onSuccess={onSuccess}
            />
        </Modal>
    );
}
