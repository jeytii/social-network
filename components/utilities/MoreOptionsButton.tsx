import { MouseEvent, useState } from 'react';
import { useQueryClient } from 'react-query';
import { MdMoreHoriz } from 'react-icons/md';
import clsx from 'clsx';
import MoreOptions from 'components/utilities/MoreOptions';
import type { ModifyItem } from 'types/item';

export default function MoreOptionsButton(props: ModifyItem) {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const queryClient = useQueryClient();

    function selectPostToBeEdited(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        queryClient.setQueryData('edit', props);

        closeOptions();
    }

    function selectPostToBeDeleted(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        queryClient.setQueryData('delete', props);

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
        <div className='relative ml-auto'>
            <button
                type='button'
                className={clsx('block rounded-full p-xs')}
                onClick={toggleOptions}
            >
                <MdMoreHoriz className='text-skin-secondary text-lg' />
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
