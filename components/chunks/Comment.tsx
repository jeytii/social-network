import { forwardRef, HTMLAttributes, Ref } from 'react';
import { InfiniteData, useQueryClient } from 'react-query';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import MoreOptionsButton from 'components/utilities/MoreOptionsButton';
import LikeButton from 'components/chunks/LikeButton';
import type { CommentPage } from 'types/page';
import type { Comment as CommentType } from 'types/comment';

type Props = CommentType & HTMLAttributes<HTMLElement>;
type QueryData = InfiniteData<CommentPage> | undefined;

const update = (
    current: QueryData,
    slug: string,
    condition: boolean,
    count: number,
) => {
    const comments = current?.pages.flatMap(page => [...page.items]);

    comments?.forEach(comment => {
        if (comment.slug === slug) {
            const c = comment;

            c.is_liked = condition;
            c.likes_count = count;
        }
    });

    return current;
};

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
    const queryClient = useQueryClient();
    const { is_self, is_followed, ...userProps } = user;
    const queryKeys = [
        ['comments', post_slug],
        ['profile.comments', user.slug],
        'profile.likes.comments',
    ];

    function onSuccess(condition: boolean, count: number) {
        queryKeys.forEach(key => {
            if (queryClient.getQueryData(key)) {
                queryClient.setQueryData<QueryData>(key, current =>
                    update(current, slug, condition, count),
                );
            }
        });
    }

    return (
        <article
            ref={ref}
            className={clsx('bg-skin-main rounded p-md', className)}
            {...props}
        >
            <div className={is_own_comment ? 'flex items-center' : 'block'}>
                <BasicInfo {...userProps} />

                {is_own_comment && (
                    <MoreOptionsButton
                        type='comment'
                        parentSlug={post_slug}
                        slug={slug}
                        value={body}
                    />
                )}
            </div>

            <p className='paragraph-md clamp text-skin-primary my-sm'>{body}</p>

            <span className='text-skin-secondary text-sm'>
                {timestamp} {is_edited && '(edited)'}
            </span>

            <div className='flex items-center mt-sm'>
                <LikeButton
                    className='flex items-center text-center'
                    route={`/api/comments/${slug}`}
                    condition={is_liked}
                    count={likes_count}
                    onSuccess={onSuccess}
                />
            </div>
        </article>
    );
}

export default forwardRef(Comment);
