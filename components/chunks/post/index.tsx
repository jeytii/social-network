import { ForwardedRef, forwardRef, HTMLAttributes, useState } from 'react';
import { MdOutlineChatBubbleOutline } from 'react-icons/md';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import MoreOptionsButton from 'components/utilities/MoreOptionsButton';
import type { Post as PostType } from 'types/post';
import LikeButton from 'components/chunks/LikeButton';
import BookmarkButton from './BookmarkButton';

type Props = PostType & HTMLAttributes<HTMLElement>;

function Post(
    {
        className,
        user,
        slug,
        body,
        is_liked,
        is_bookmarked,
        likes_count,
        comments_count,
        is_own_post,
        is_edited,
        timestamp,
        ...props
    }: Props,
    ref: ForwardedRef<HTMLElement>,
) {
    const [liked, setLiked] = useState<boolean>(is_liked);
    const [likesCount, setLikesCount] = useState<number>(likes_count);
    const [bookmarked, setBookmarked] = useState<boolean>(is_bookmarked);
    const { username, is_self, ...userProps } = user;

    return (
        <article
            ref={ref}
            className={clsx(
                'bg-skin-bg-contrast-light border border-skin-bg-contrast hover:bg-skin-bg-contrast rounded-md',
                className,
            )}
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
                        <MoreOptionsButton
                            className='relative ml-auto'
                            queryKey='posts'
                            slug={slug}
                            edit={{
                                label: 'Edit post',
                                value: body,
                                placholder: 'Edit post',
                                apiUrl: `/api/posts/${slug}`,
                            }}
                        />
                    )}
                </div>

                <p className='paragraph-md text-skin-text my-sm clamp'>
                    {body}
                </p>

                <span className='text-skin-text-light text-sm'>
                    {timestamp} {is_edited && '(edited)'}
                </span>
            </section>

            <section className='flex bg-skin-bg-contrast-light'>
                <LikeButton
                    className='flex-1 flex items-center justify-center text-center py-sm'
                    route={`/api/posts/${slug}`}
                    condition={liked}
                    count={likesCount}
                    stateEvent={setLiked}
                    setCountEvent={setLikesCount}
                />

                <button
                    className='flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-skin-text'
                    type='button'
                >
                    <MdOutlineChatBubbleOutline className='text-lg' />
                    <span className='text-sm ml-sm'>{comments_count}</span>
                </button>

                <BookmarkButton
                    postSlug={slug}
                    condition={bookmarked}
                    stateEvent={setBookmarked}
                />
            </section>
        </article>
    );
}

export default forwardRef(Post);