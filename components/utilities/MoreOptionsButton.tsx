import { HTMLAttributes, MouseEvent, useState } from 'react';
import { useQueryClient, QueryKey } from 'react-query';
import { MdMoreHoriz } from 'react-icons/md';
import clsx from 'clsx';
import MoreOptions from 'components/utilities/MoreOptions';

interface Props extends HTMLAttributes<HTMLDivElement> {
    queryKey: QueryKey;
    slug: string;
    edit: {
        label: string;
        value: string;
        placeholder: string;
        apiUrl: string;
    };
    delete: {
        title: string;
        message: string;
        apiUrl: string;
    };
}

export default function MoreOptionsButton({
    queryKey,
    slug,
    edit,
    delete: deleteItem,
    ...props
}: Props) {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const queryClient = useQueryClient();

    function selectPostToBeEdited(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        queryClient.setQueryData('edit', { queryKey, slug, ...edit });
        closeOptions();
    }

    function selectPostToBeDeleted(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        queryClient.setQueryData('delete', {
            queryKey,
            slug,
            ...deleteItem,
        });

        closeOptions();
    }

    function toggleOptions(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        setShowOptions(current => !current);
    }

    function closeOptions() {
        setShowOptions(false);
    }

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
