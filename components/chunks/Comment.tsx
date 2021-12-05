import { useRouter } from 'next/router';
import { forwardRef, HTMLAttributes, Ref, useCallback } from 'react';
import { InfiniteData, useQueryClient } from 'react-query';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import MoreOptionsButton from 'components/utilities/MoreOptionsButton';
import LikeButton from 'components/chunks/LikeButton';
import type { CommentPage } from 'types/page';
import type { Comment as CommentType } from 'types/comment';

type Props = CommentType & HTMLAttributes<HTMLElement>;
type QueryData = InfiniteData<CommentPage> | undefined;

const set = (
    current: QueryData,
    slug: string,
    condition: boolean,
): QueryData => {
    const comments = current?.pages.flatMap(page => [...page.items]);

    comments?.forEach(comment => {
        if (comment.slug === slug) {
            const c = comment;

            c.is_liked = condition;
            c.likes_count = condition ? c.likes_count + 1 : c.likes_count - 1;
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
    const { asPath } = useRouter();
    const { is_self, is_followed, ...userProps } = user;

    const onSuccess = useCallback(async (condition: boolean) => {
        if (queryClient.getQueryData('profile.likes.comments')) {
            queryClient.setQueryData<QueryData>(
                'profile.likes.comments',
                current => set(current, slug, condition),
            );
        }

        if (queryClient.getQueryData(['profile.comments', user.slug])) {
            queryClient.setQueryData<QueryData>(
                ['profile.comments', user.slug],
                current => set(current, slug, condition),
            );
        }

        if (asPath === '/likes?s=comments' && !condition) {
            await queryClient.invalidateQueries<CommentPage>(
                'profile.likes.comments',
                {
                    refetchPage: page =>
                        !!page.items.find(item => item.slug === slug),
                },
            );
        }
    }, []);

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
                    onSuccess={onSuccess}
                />
            </div>
        </article>
    );
}

export default forwardRef(Comment);
