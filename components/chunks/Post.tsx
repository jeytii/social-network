import { HTMLAttributes, useState } from 'react';
import {
    MdThumbUp,
    MdOutlineThumbUp,
    MdOutlineChatBubbleOutline,
    MdBookmark,
    MdBookmarkBorder,
} from 'react-icons/md';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import BasicInfo from 'components/utilities/BasicInfo';
import type { Post as PostType } from 'types/post';
import MoreButton from 'components/utilities/MoreButton';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'config/axios';

interface Props extends PostType, HTMLAttributes<HTMLElement> { }

const token = Cookies.get('token');

export default function Post({
    className,
    user,
    slug,
    is_liked,
    is_bookmarked,
    likes_count,
    comments_count,
    is_own_post,
    is_edited,
    ...props
}: Props) {
    const [liked, setLiked] = useState<boolean>(is_liked);
    const [likesCount, setLikesCount] = useState<number>(likes_count);
    const [bookmarked, setBookmarked] = useState<boolean>(is_bookmarked);
    const [debounce, mutatePreviousLikedState] = useDebounceClick(
        liked,
        sendLikePostRequest,
        sendDislikePostRequest,
    );

    const { username, is_self, ...userProps } = user;

    async function sendLikePostRequest() {
        try {
            const { data } = await axios(token).post(`/api/posts/${slug}/like`);

            setLikesCount(data.data);
            mutatePreviousLikedState(true);
        } catch (e) {
            setLiked(false);
        }
    }

    async function sendDislikePostRequest() {
        try {
            const { data } = await axios(token).delete(
                `/api/posts/${slug}/dislike`,
            );

            setLikesCount(data.data);
            mutatePreviousLikedState(false);
        } catch (e) {
            setLiked(true);
        }
    }

    function toggleLike() {
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
        <article
            className={clsx('bg-skin-bg-contrast rounded-md', className)}
            {...props}
        >
            <section className='p-md'>
                <div className={is_own_post ? 'flex items-center' : 'block'}>
                    <BasicInfo
                        username={`@${username}`}
                        imageSize={50}
                        {...userProps}
                    />

                    {(is_own_post || is_self) && (
                        <MoreButton className='relative ml-auto' slug={slug} />
                    )}
                </div>

                <p className='paragraph-md text-skin-text my-sm clamp'>
                    {props.body}
                </p>

                <span className='text-skin-text-light text-sm'>
                    {props.timestamp} {is_edited && '(edited)'}
                </span>
            </section>

            <section className='flex bg-skin-bg-contrast-light'>
                <button
                    className={clsx(
                        'flex-1 flex items-center justify-center text-center py-sm',
                        liked
                            ? 'text-primary'
                            : 'text-skin-text-light hover:text-primary',
                    )}
                    type='button'
                    onClick={toggleLike}
                >
                    {liked ? (
                        <MdThumbUp className='text-lg' />
                    ) : (
                        <MdOutlineThumbUp className='text-lg' />
                    )}

                    <span className='text-sm ml-sm'>{likesCount}</span>
                </button>

                <button
                    className='flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-skin-text'
                    type='button'
                >
                    <MdOutlineChatBubbleOutline className='text-lg' />
                    <span className='text-sm ml-sm'>{comments_count}</span>
                </button>

                <button
                    className={clsx(
                        'flex-1 flex items-center justify-center text-skin-text-light text-center py-sm',
                        !bookmarked && 'hover:text-skin-text',
                    )}
                    type='button'
                >
                    {bookmarked ? (
                        <MdBookmark className='text-lg' />
                    ) : (
                        <MdBookmarkBorder className='text-lg' />
                    )}
                </button>
            </section>
        </article>
    );
}
