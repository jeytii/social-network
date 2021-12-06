import { forwardRef, HTMLAttributes, Ref } from 'react';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import MoreOptionsButton from 'components/utilities/MoreOptionsButton';
import LikeButton from 'components/chunks/LikeButton';
import type { Comment as CommentType } from 'types/comment';

type Props = CommentType & HTMLAttributes<HTMLElement>;

function Comment(
    {
        className,
        slug,
        post_slug,
        body,
        likes_count,
        is_own_comment,
        is_liked,
        is_edited,
        timestamp,
        user,
        ...props
    }: Props,
    ref: Ref<HTMLElement>,
) {
    const { is_self, is_followed, ...userProps } = user;

    return (
        <article
            ref={ref}
            className={clsx('bg-skin-bg-contrast rounded-md p-md', className)}
            {...props}
        >
            <div className={is_own_comment ? 'flex items-center' : 'block'}>
                <BasicInfo {...userProps} />

                {is_own_comment && (
                    <MoreOptionsButton
                        type='comment'
                        slug={slug}
                        value={body}
                    />
                )}
            </div>

            <p className='paragraph-md clamp text-skin-text my-sm'>{body}</p>

            <span className='text-skin-text-light text-sm'>
                {timestamp} {is_edited && '(edited)'}
            </span>

            <div className='flex items-center mt-sm'>
                <LikeButton
                    className='flex items-center text-center'
                    route={`/api/comments/${slug}`}
                    condition={is_liked}
                    count={likes_count}
                />
            </div>
        </article>
    );
}

export default forwardRef(Comment);
