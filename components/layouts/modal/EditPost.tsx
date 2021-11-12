import { useEffect } from 'react';
import { useQueryClient, useQuery, InfiniteData } from 'react-query';
import { MdAccountCircle, MdClose } from 'react-icons/md';
import { Dialog } from '@headlessui/react';
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
        <Modal>
            <Dialog
                as='div'
                className='modal-wrapper overflow-y-auto'
                open
                onClose={closeModal}
            >
                <div className='w-[720px] px-4 text-center'>
                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className='inline-block h-screen align-middle'
                        aria-hidden='true'
                    >
                        &#8203;
                    </span>

                    <div className='inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl bg-skin-bg'>
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
                    </div>
                </div>
            </Dialog>
        </Modal>
    );
}
