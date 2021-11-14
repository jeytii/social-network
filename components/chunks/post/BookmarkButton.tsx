import { Dispatch, SetStateAction } from 'react';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'config/axios';

interface Props {
    postSlug: string;
    condition: boolean;
    stateEvent: Dispatch<SetStateAction<boolean>>;
}

const token = Cookies.get('token');

export default function BookmarkButton({
    postSlug,
    condition,
    stateEvent,
}: Props) {
    const [debounce, mutatePreviousState] = useDebounceClick(
        condition,
        sendBookmarkPostRequest,
        sendUnbookmarkPostRequest,
    );

    async function sendBookmarkPostRequest() {
        try {
            await axios(token).post(`/api/posts/${postSlug}/bookmark`);

            mutatePreviousState(true);
        } catch (e) {
            stateEvent(false);
        }
    }

    async function sendUnbookmarkPostRequest() {
        try {
            await axios(token).delete(`/api/posts/${postSlug}/unbookmark`);

            mutatePreviousState(false);
        } catch (e) {
            stateEvent(true);
        }
    }

    function toggleBookmark() {
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
                <MdBookmark className='text-lg' />
            ) : (
                <MdBookmarkBorder className='text-lg' />
            )}
        </button>
    );
}
