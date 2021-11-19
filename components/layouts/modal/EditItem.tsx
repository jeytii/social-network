import { useQueryClient, InfiniteData, QueryKey } from 'react-query';
import { MdAccountCircle, MdClose } from 'react-icons/md';
import TextBox from 'components/utilities/TextBox';
import type { PostPage, CommentPage } from 'types/page';
import type { Post } from 'types/post';
import type { Comment } from 'types/comment';
import Modal from '.';

type SetQueryData = InfiniteData<PostPage | CommentPage> | undefined;

interface Variables {
    body: string;
}

interface EditItem {
    queryKey: QueryKey;
    slug: string;
    label: string;
    value: string;
    placholder: string;
    apiUrl: string;
}

export default function EditItemModal({ isOpen }: { isOpen: boolean }) {
    const queryClient = useQueryClient();
    const item = queryClient.getQueryData<EditItem>('edit');

    const successEvent = (_: never, { body }: Variables) => {
        queryClient.setQueryData<SetQueryData>(
            item?.queryKey as string,
            current => {
                current?.pages.forEach(page => {
                    const selectedItem = (
                        page.items as (Post | Comment)[]
                    ).find(i => i.slug === item?.slug);

                    if (selectedItem) {
                        selectedItem.body = body;
                        selectedItem.is_edited = true;
                    }
                });

                return current;
            },
        );

        queryClient.setQueryData('edit', null);
    };

    const closeModal = () => {
        queryClient.setQueryData('edit', null);
    };

    return (
        <Modal isOpen={isOpen} closeEvent={closeModal}>
            <header className='flex items-center py-sm px-md'>
                <MdAccountCircle
                    className='text-skin-text'
                    size={30}
                    viewBox='2 2 20 20'
                />

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
                value={item?.value}
                apiUrl={item?.apiUrl}
                apiMethod='put'
                successEvent={successEvent}
            />
        </Modal>
    );
}
