import { useState, HTMLAttributes } from 'react';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import MoreOptionsButton from 'components/utilities/MoreOptionsButton';
import LikeButton from 'components/chunks/LikeButton';
import type { Comment as CommentType } from 'types/comment';

type Props = CommentType & HTMLAttributes<HTMLElement>;

export default function Comment({
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
}: Props) {
    const [liked, setLiked] = useState<boolean>(is_liked);
    const [likesCount, setLikesCount] = useState<number>(likes_count);
    const { username, is_self, is_followed, ...userProps } = user;

    return (
        <article
            className={clsx('bg-skin-bg-contrast rounded-md p-md', className)}
            {...props}
        >
            <div className={is_own_comment ? 'flex items-center' : 'block'}>
                <BasicInfo username={`@${username}`} {...userProps} />

                {is_own_comment && (
                    <MoreOptionsButton
                        className='relative ml-auto'
                        queryKey={['comments', post_slug]}
                        slug={slug}
                        edit={{
                            label: 'Edit comment',
                            value: body,
                            placeholder: 'Edit comment',
                            apiUrl: `/api/comments/${slug}`,
                        }}
                        delete={{
                            title: 'Confirmation to delete comment',
                            message:
                                'Are you sure you want to delete this comment?',
                            apiUrl: `/api/comments/${slug}`,
                        }}
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
                    condition={liked}
                    count={likesCount}
                    stateEvent={setLiked}
                    setCountEvent={setLikesCount}
                />
            </div>
        </article>
    );
}
