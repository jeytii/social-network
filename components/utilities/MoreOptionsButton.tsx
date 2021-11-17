import { HTMLAttributes, MouseEvent, useState } from 'react';
import { useQueryClient } from 'react-query';
import { MdMoreHoriz } from 'react-icons/md';
import clsx from 'clsx';
import MoreOptions from 'components/utilities/MoreOptions';

interface Props extends HTMLAttributes<HTMLDivElement> {
    queryKey: string;
    slug: string;
    edit: {
        label: string;
        value: string;
        placholder: string;
        apiUrl: string;
    };
}

export default function MoreOptionsButton({
    queryKey,
    slug,
    edit,
    ...props
}: Props) {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const selectPostToBeEdited = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        queryClient.setQueryData('edit', { queryKey, slug, ...edit });
        setShowOptions(false);
    };

    const selectPostToBeDeleted = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        queryClient.setQueryData('delete.post', slug);
        queryClient.setQueryData('showDeletePostModal', true);
        setShowOptions(false);
    };

    function toggleOptions(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

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
