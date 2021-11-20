import { useState, HTMLAttributes, MouseEvent } from 'react';
import { MdThumbUp, MdOutlineThumbUp } from 'react-icons/md';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'config/axios';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    route: string;
    condition: boolean;
    count: number;
    successEvent(): void;
}

const authToken = Cookies.get('token');

export default function LikeButton({
    className,
    route,
    condition,
    count,
    successEvent,
    ...props
}: Props) {
    const [liked, setLiked] = useState<boolean>(condition);
    const [likesCount, setLikesCount] = useState<number>(count);
    const [debounce, mutatePrevious] = useDebounceClick(liked, like, dislike);

    async function like() {
        try {
            const { data } = await axios(authToken).post(`${route}/like`);

            successEvent();

            setLikesCount(data.data);
            mutatePrevious(true);
        } catch (e) {
            setLiked(false);
        }
    }

    async function dislike() {
        try {
            const { data } = await axios(authToken).delete(`${route}/dislike`);

            successEvent();

            setLikesCount(data.data);
            mutatePrevious(false);
        } catch (e) {
            setLiked(true);
        }
    }

    function toggleLike(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        setLiked(current => !current);

        setLikesCount(current => {
            if (liked) {
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
                liked
                    ? 'text-primary'
                    : 'text-skin-text-light hover:text-primary',
            )}
            type='button'
            onClick={toggleLike}
            {...props}
        >
            {liked ? (
                <MdThumbUp className='text-lg sm:text-md' />
            ) : (
                <MdOutlineThumbUp className='text-lg sm:text-md' />
            )}

            <span className='text-sm ml-sm'>{likesCount}</span>
        </button>
    );
}
