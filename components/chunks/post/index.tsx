import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import { MdOutlineChatBubbleOutline } from 'react-icons/md';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import MoreOptionsButton from 'components/utilities/MoreOptionsButton';
import LikeButton from 'components/chunks/LikeButton';
import type { Post as PostType } from 'types/post';
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
    const { is_self, ...userProps } = user;

    return (
        <article
            ref={ref}
            className={clsx(
                'bg-skin-bg-contrast-light border border-skin-bg-contrast rounded-md hover:bg-skin-bg-contrast',
                className,
            )}
            {...props}
        >
            <section className='p-md'>
                <div className={is_own_post ? 'flex items-center' : 'block'}>
                    <BasicInfo {...userProps} />

                    {(is_own_post || is_self) && (
                        <MoreOptionsButton
                            type='post'
                            slug={slug}
                            value={body}
                        />
                    )}
                </div>

                <p className='paragraph-md text-skin-text my-sm clamp'>
                    {body}
                </p>

                <span className='text-skin-text-light text-sm xs:text-xs'>
                    {timestamp} {is_edited && '(edited)'}
                </span>
            </section>

            <section className='flex bg-skin-bg-contrast-light border-t border-skin-bg-contrast'>
                <LikeButton
                    className='flex-1 flex items-center justify-center text-center py-sm'
                    route={`/api/posts/${slug}`}
                    condition={is_liked}
                    count={likes_count}
                />

                <button
                    className='flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-skin-text'
                    type='button'
                >
                    <MdOutlineChatBubbleOutline className='text-lg sm:text-md' />
                    <span className='text-sm ml-sm'>{comments_count}</span>
                </button>

                <BookmarkButton
                    route={`/api/posts/${slug}`}
                    condition={is_bookmarked}
                />
            </section>
        </article>
    );
}

export default forwardRef(Post);
