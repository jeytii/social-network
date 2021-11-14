import { Dispatch, SetStateAction } from 'react';
import { MdThumbUp, MdOutlineThumbUp } from 'react-icons/md';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'config/axios';

interface Props {
    postSlug: string;
    condition: boolean;
    count: number;
    stateEvent: Dispatch<SetStateAction<boolean>>;
    setCountEvent: Dispatch<SetStateAction<number>>;
}

const token = Cookies.get('token');

export default function LikeButton({
    postSlug,
    condition,
    count,
    stateEvent,
    setCountEvent,
}: Props) {
    const [debounce, mutatePreviousState] = useDebounceClick(
        condition,
        sendLikePostRequest,
        sendDislikePostRequest,
    );

    async function sendLikePostRequest() {
        try {
            const { data } = await axios(token).post(
                `/api/posts/${postSlug}/like`,
            );

            setCountEvent(data.data);
            mutatePreviousState(true);
        } catch (e) {
            stateEvent(false);
        }
    }

    async function sendDislikePostRequest() {
        try {
            const { data } = await axios(token).delete(
                `/api/posts/${postSlug}/dislike`,
            );

            setCountEvent(data.data);
            mutatePreviousState(false);
        } catch (e) {
            stateEvent(true);
        }
    }

    function toggleLike() {
        stateEvent(current => !current);

        setCountEvent(current => {
            if (condition) {
                return current - 1;
            }

            return current + 1;
        });

        debounce();
    }

    return (
        <button
            className={clsx(
                'flex-1 flex items-center justify-center text-center py-sm',
                condition
                    ? 'text-primary'
                    : 'text-skin-text-light hover:text-primary',
            )}
            type='button'
            onClick={toggleLike}
        >
            {condition ? (
                <MdThumbUp className='text-lg' />
            ) : (
                <MdOutlineThumbUp className='text-lg' />
            )}

            <span className='text-sm ml-sm'>{count}</span>
        </button>
    );
}
