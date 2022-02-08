import { useState, MouseEvent } from 'react';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'lib/axios';

interface Props {
    route: string;
    condition: boolean;
    onSuccess(condition: boolean): void;
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
            await axios().post(`${route}/bookmark`);

            onSuccess(true);
            mutatePreviousState(true);
        } catch (e) {
            setBookmarked(false);
        }
    }

    async function unbookmark() {
        try {
            await axios().delete(`${route}/unbookmark`);

            onSuccess(false);
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
                'flex items-center justify-center text-skin-secondary text-center',
                !bookmarked && 'hover:text-skin-primary',
            )}
            type='button'
            onClick={toggleBookmark}
        >
            {bookmarked ? <MdBookmark /> : <MdBookmarkBorder />}
        </button>
    );
}
