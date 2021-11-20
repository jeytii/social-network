import { Dispatch, HTMLAttributes, MouseEvent, SetStateAction } from 'react';
import { MdThumbUp, MdOutlineThumbUp } from 'react-icons/md';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'config/axios';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    route: string;
    condition: boolean;
    count: number;
    stateEvent: Dispatch<SetStateAction<boolean>>;
    setCountEvent: Dispatch<SetStateAction<number>>;
}

const authToken = Cookies.get('token');

export default function LikeButton({
    className,
    route,
    condition,
    count,
    stateEvent,
    setCountEvent,
    ...props
}: Props) {
    const [debounce, mutatePreviousState] = useDebounceClick(
        condition,
        like,
        dislike,
    );

    async function like() {
        try {
            const { data } = await axios(authToken).post(`${route}/like`);

            setCountEvent(data.data);
            mutatePreviousState(true);
        } catch (e) {
            stateEvent(false);
        }
    }

    async function dislike() {
        try {
            const { data } = await axios(authToken).delete(`${route}/dislike`);

            setCountEvent(data.data);
            mutatePreviousState(false);
        } catch (e) {
            stateEvent(true);
        }
    }

    function toggleLike(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

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
                className,
                condition
                    ? 'text-primary'
                    : 'text-skin-text-light hover:text-primary',
            )}
            type='button'
            onClick={toggleLike}
            {...props}
        >
            {condition ? (
                <MdThumbUp className='text-lg sm:text-md' />
            ) : (
                <MdOutlineThumbUp className='text-lg sm:text-md' />
            )}

            <span className='text-sm ml-sm'>{count}</span>
        </button>
    );
}
