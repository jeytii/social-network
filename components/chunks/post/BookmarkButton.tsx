import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import { axiosClient } from 'config/axios';

interface Props {
    postSlug: string;
    condition: boolean;
    stateEvent: Dispatch<SetStateAction<boolean>>;
}

export default function BookmarkButton({
    postSlug,
    condition,
    stateEvent,
}: Props) {
    const [debounce, mutatePreviousState] = useDebounceClick(
        condition,
        bookmark,
        unbookmark,
    );

    async function bookmark() {
        try {
            await axiosClient().post(`/api/posts/${postSlug}/bookmark`);

            mutatePreviousState(true);
        } catch (e) {
            stateEvent(false);
        }
    }

    async function unbookmark() {
        try {
            await axiosClient().delete(`/api/posts/${postSlug}/unbookmark`);

            mutatePreviousState(false);
        } catch (e) {
            stateEvent(true);
        }
    }

    function toggleBookmark(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        stateEvent(current => !current);
        debounce();
    }

    return (
        <button
            className={clsx(
                'flex-1 flex items-center justify-center text-skin-text-light text-center py-sm',
                !condition && 'hover:text-skin-text',
            )}
            type='button'
            onClick={toggleBookmark}
        >
            {condition ? (
                <MdBookmark className='text-lg sm:text-md' />
            ) : (
                <MdBookmarkBorder className='text-lg sm:text-md' />
            )}
        </button>
    );
}
