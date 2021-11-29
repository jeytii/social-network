import { useState, MouseEvent } from 'react';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import { axiosClient } from 'config/axios';

interface Props {
    route: string;
    condition: boolean;
    onSuccess(liked: boolean, actionType: 'like' | 'bookmark'): void;
}

export default function BookmarkButton({ route, condition, onSuccess }: Props) {
    const [bookmarked, setBookmarked] = useState<boolean>(condition);
    const [debounce, mutatePreviousState] = useDebounceClick(
        bookmarked,
        bookmark,
        unbookmark,
    );

    async function bookmark() {
        try {
            await axiosClient().post(`${route}/bookmark`);

            onSuccess(true, 'bookmark');
            mutatePreviousState(true);
        } catch (e) {
            setBookmarked(false);
        }
    }

    async function unbookmark() {
        try {
            await axiosClient().delete(`${route}/unbookmark`);

            onSuccess(false, 'bookmark');
            mutatePreviousState(false);
        } catch (e) {
            setBookmarked(true);
        }
    }

    function toggleBookmark(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        setBookmarked(current => !current);
        debounce();
    }

    return (
        <button
            className={clsx(
                'flex-1 flex items-center justify-center text-skin-text-light text-center py-sm',
                !bookmarked && 'hover:text-skin-text',
            )}
            type='button'
            onClick={toggleBookmark}
        >
            {bookmarked ? (
                <MdBookmark className='text-lg sm:text-md' />
            ) : (
                <MdBookmarkBorder className='text-lg sm:text-md' />
            )}
        </button>
    );
}
