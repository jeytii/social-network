import { HTMLAttributes, useState } from 'react';
import { InfiniteData, useQueryClient } from 'react-query';
import {
    MdMoreHoriz,
    MdThumbUp,
    MdOutlineThumbUp,
    MdOutlineChatBubbleOutline,
    MdBookmark,
    MdBookmarkBorder,
} from 'react-icons/md';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import PostOptions from 'components/utilities/PostOptions';
import type { Post as PostType } from 'types/post';
import type { PostPage } from 'types/page';

interface Props extends PostType, HTMLAttributes<HTMLElement> { }

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
    const [bookmarked, setBookmarked] = useState<boolean>(is_bookmarked);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const { username, is_self, ...userProps } = user;

    function toggleOptions() {
        setShowOptions(current => !current);
    }

    const closeOptions = () => {
        setShowOptions(false);
    };

    const formatPostsData = () => {
        const posts = queryClient.getQueryData<InfiniteData<PostPage>>('posts');

        if (!posts?.pages.length) {
            return [];
        }

        if (posts?.pages.length === 1) {
            return posts?.pages[0].items;
        }

        return posts?.pages.flatMap(page => [...page.items]);
    };

    const selectPostToBeEdited = () => {
        const posts = formatPostsData();
        const post = posts.find(p => p.slug === slug);

        queryClient.setQueryData('edit.post', post);
        queryClient.setQueryData('showEditPostModal', true);
    };

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
                        <div className='relative ml-auto'>
                            <button
                                type='button'
                                className={clsx(
                                    'block rounded-full p-xs',
                                    showOptions
                                        ? 'bg-skin-bg-contrast-light'
                                        : 'hover:bg-skin-bg-contrast-light',
                                )}
                                onClick={toggleOptions}
                            >
                                <MdMoreHoriz className='text-skin-text-light text-lg' />
                            </button>

                            {showOptions && (
                                <PostOptions
                                    editEvent={selectPostToBeEdited}
                                    close={closeOptions}
                                />
                            )}
                        </div>
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
