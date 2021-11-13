import { useEffect } from 'react';
import { useQueryClient, useQuery, InfiniteData } from 'react-query';
import { MdAccountCircle, MdClose } from 'react-icons/md';
import PostBox from 'components/chunks/PostBox';
import type { Post } from 'types/post';
import type { PostPage } from 'types/page';
import Modal from '.';

export default function EditPostModal() {
    const queryClient = useQueryClient();
    const { data: selectedPost } = useQuery<unknown, unknown, Post>(
        'edit.post',
        () => queryClient.getQueryData('edit.post'),
    );

    const onSuccessEvent = (
        current: InfiniteData<PostPage>,
        data: never,
        { body }: { body: string },
    ) => {
        current.pages.forEach(page => {
            const post = page.items.find(i => i.slug === selectedPost?.slug);

            if (post) {
                post.body = body;
                post.is_edited = true;
            }
        });

        return current;
    };

    const closeModal = () => {
        queryClient.setQueryData('showEditPostModal', false);
    };

    useEffect(() => {
        return () => {
            queryClient.removeQueries('edit.post');
        };
    }, []);

    return (
        <Modal closeEvent={closeModal}>
            <header className='flex items-center py-sm px-md'>
                <MdAccountCircle
                    className='text-skin-text'
                    size={35}
                    viewBox='2 2 20 20'
                />

                <h1 className='text-md text-skin-text font-bold ml-sm'>
                    Edit post
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

            <PostBox
                placeholder="What's on your mind?"
                buttonLabel='Edit post'
                rows={5}
                value={selectedPost?.body || ''}
                apiUrl={`/api/posts/${selectedPost?.slug}`}
                apiMethod='put'
                onSuccessEvent={onSuccessEvent}
            />
        </Modal>
    );
}
