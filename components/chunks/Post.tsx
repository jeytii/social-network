import { HTMLAttributes, useState } from 'react';
import BasicInfo from 'components/utilities/BasicInfo';
import {
    MdMoreHoriz,
    MdThumbUp,
    MdOutlineThumbUp,
    MdOutlineChatBubbleOutline,
    MdBookmark,
    MdBookmarkBorder,
} from 'react-icons/md';
import clsx from 'clsx';
import type { Post as PostType } from 'types/post';

interface Props extends PostType, HTMLAttributes<HTMLElement> { }

export default function Post({
    className,
    user,
    is_liked,
    is_bookmarked,
    likes_count,
    comments_count,
    is_own_post,
    is_edited,
    ...props
}: Props) {
    const [liked, setLiked] = useState<boolean>(is_liked);
    const [bookmarked, setBookmarked] = useState<boolean>(is_bookmarked);
    const { username, ...userProps } = user;

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

                    {is_own_post && (
                        <button
                            type='button'
                            className='rounded-full p-xs ml-auto hover:bg-skin-bg-contrast-light'
                        >
                            <MdMoreHoriz className='text-skin-text-light text-lg' />
                        </button>
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
                >
                    {liked ? (
                        <MdThumbUp className='text-lg' />
                    ) : (
                        <MdOutlineThumbUp className='text-lg' />
                    )}

                    <span className='text-sm ml-sm'>{likes_count}</span>
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
