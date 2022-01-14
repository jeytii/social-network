import { useState, memo, HTMLAttributes, MouseEvent } from 'react';
import { MdThumbUp, MdOutlineThumbUp } from 'react-icons/md';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'lib/axios';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    route: string;
    condition: boolean;
    count: number;
    onSuccess(condition: boolean, count: number): void;
}

function LikeButton({
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
            const { data } = await axios().post(`${route}/like`);

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
            const { data } = await axios().delete(`${route}/dislike`);

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
                    ? 'text-primary-dark'
                    : 'text-skin-secondary hover:text-primary-dark',
            )}
            type='button'
            onClick={toggleLike}
            {...props}
        >
            {liked ? <MdThumbUp /> : <MdOutlineThumbUp />}

            <span className='text-sm ml-xs'>{likesCount}</span>
        </button>
    );
}

export default memo(LikeButton);
