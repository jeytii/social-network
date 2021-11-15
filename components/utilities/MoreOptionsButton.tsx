import { HTMLAttributes, useState } from 'react';
import { useQueryClient, InfiniteData } from 'react-query';
import { MdMoreHoriz } from 'react-icons/md';
import clsx from 'clsx';
import MoreOptions from 'components/utilities/MoreOptions';
import type { PostPage } from 'types/page';

interface Props extends HTMLAttributes<HTMLDivElement> {
    slug: string;
}

export default function MoreOptionsButton({ slug, ...props }: Props) {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const formatPostsData = () => {
        const posts = queryClient.getQueryData<InfiniteData<PostPage>>('posts');

        if (!posts?.pages.length) {
            return [];
        }

        if (posts?.pages.length === 1) {
            return posts?.pages[0].items;
        }

        return posts?.pages.flatMap(page => [...page.items]);
    };

    const selectPostToBeEdited = () => {
        const posts = formatPostsData();
        const post = posts.find(p => p.slug === slug);

        queryClient.setQueryData('edit.post', post);
        queryClient.setQueryData('showEditPostModal', true);
    };

    const selectPostToBeDeleted = () => {
        queryClient.setQueryData('delete.post', slug);
        queryClient.setQueryData('showDeletePostModal', true);
    };

    function toggleOptions() {
        setShowOptions(current => !current);
    }

    const closeOptions = () => {
        setShowOptions(false);
    };

    return (
        <div {...props}>
            <button
                type='button'
                className={clsx(
                    'block rounded-full p-xs',
                    showOptions
                        ? 'bg-skin-bg-contrast-light'
                        : 'hover:bg-skin-bg-contrast-light',
                )}
                onClick={toggleOptions}
            >
                <MdMoreHoriz className='text-skin-text-light text-lg' />
            </button>

            {showOptions && (
                <MoreOptions
                    editEvent={selectPostToBeEdited}
                    deleteEvent={selectPostToBeDeleted}
                    close={closeOptions}
                />
            )}
        </div>
    );
}
