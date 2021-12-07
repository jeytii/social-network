import { useState, HTMLAttributes, MouseEvent } from 'react';
import { MdThumbUp, MdOutlineThumbUp } from 'react-icons/md';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import { axiosClient } from 'config/axios';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    route: string;
    condition: boolean;
    count: number;
    onSuccess(condition: boolean, count: number): void;
}

export default function LikeButton({
    className,
    route,
    condition,
    count,
    onSuccess,
    ...props
}: Props) {
    const [liked, setLiked] = useState<boolean>(condition);
    const [likesCount, setLikesCount] = useState<number>(count);
    const [debounce, mutatePrevious] = useDebounceClick(liked, like, dislike);

    async function like() {
        try {
            const { data } = await axiosClient().post(`${route}/like`);

            onSuccess(true, data.data);
            setLikesCount(data.data);
            mutatePrevious(true);
        } catch (e) {
            setLiked(false);
            setLikesCount(current => current - 1);
        }
    }

    async function dislike() {
        try {
            const { data } = await axiosClient().delete(`${route}/dislike`);

            onSuccess(false, data.data);
            setLikesCount(data.data);
            mutatePrevious(false);
        } catch (e) {
            setLiked(true);
            setLikesCount(current => current + 1);
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
