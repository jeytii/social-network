import { useEffect } from 'react';
import { useQueryClient, InfiniteData } from 'react-query';
import { MdAccountCircle, MdClose } from 'react-icons/md';
import TextBox from 'components/utilities/TextBox';
import type { PostPage, CommentPage } from 'types/page';
import type { Post } from 'types/post';
import type { Comment } from 'types/comment';
import Modal from '.';

type SetQueryData = InfiniteData<PostPage | CommentPage> | undefined;

interface EditItem {
    queryKey: string;
    slug: string;
    label: string;
    value: string;
    placholder: string;
    apiUrl: string;
}

export default function EditItemModal({ isOpen }: { isOpen: boolean }) {
    const queryClient = useQueryClient();
    const item = queryClient.getQueryData<EditItem>('edit');

    const successEvent = (_: never, { body }: { body: string }) => {
        queryClient.setQueryData<SetQueryData>(
            item?.queryKey as string,
            current => {
                if (current) {
                    current.pages.forEach(page => {
                        const post = (page.items as (Post | Comment)[]).find(
                            i => i.slug === item?.slug,
                        );

                        if (post) {
                            post.body = body;
                            post.is_edited = true;
                        }
                    });
                }

                return current;
            },
        );

        queryClient.setQueryData('edit', null);
    };

    const closeModal = () => {
        queryClient.setQueryData('edit', null);
        // queryClient.removeQueries('edit');
    };

    useEffect(() => {
        return () => {
            queryClient.removeQueries('edit');
        };
    }, []);

    return (
        <Modal isOpen={isOpen} closeEvent={closeModal}>
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

            <TextBox
                placeholder={item?.placholder}
                buttonLabel={item?.label}
                rows={5}
                value={item?.value}
                apiUrl={item?.apiUrl}
                apiMethod='put'
                successEvent={successEvent}
            />
        </Modal>
    );
}
