import { useCallback, ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import { InfiniteData, useQueryClient } from 'react-query';
import { MdOutlineChatBubbleOutline } from 'react-icons/md';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import MoreOptionsButton from 'components/utilities/MoreOptionsButton';
import LikeButton from 'components/chunks/LikeButton';
import type { PostPage } from 'types/page';
import type { Post as PostType } from 'types/post';
import BookmarkButton from './BookmarkButton';

type Props = PostType & HTMLAttributes<HTMLElement>;
type QueryData = InfiniteData<PostPage> | undefined;

const set = (
    current: QueryData,
    slug: string,
    condition: boolean,
    actionType: 'like' | 'bookmark',
): QueryData => {
    if (!current) {
        return undefined;
    }

    const posts = current.pages.flatMap(page => [...page.items]);

    posts.forEach(post => {
        if (post.slug === slug) {
            const p = post;

            if (actionType === 'like') {
                p.is_liked = condition;
                p.likes_count = condition
                    ? p.likes_count + 1
                    : p.likes_count - 1;
            } else {
                p.is_bookmarked = condition;
            }
        }
    });

    return current;
};

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
    const queryClient = useQueryClient();
    const { is_self, ...userProps } = user;

    const onSuccess = useCallback(
        (condition: boolean, actionType: 'like' | 'bookmark') => {
            queryClient.setQueryData<QueryData>('posts', current =>
                set(current, slug, condition, actionType),
            );

            queryClient.setQueryData<QueryData>(
                ['profile.posts', user.slug],
                current => set(current, slug, condition, actionType),
            );

            queryClient.setQueryData<QueryData>('profile.bookmarks', current =>
                set(current, slug, condition, actionType),
            );

            queryClient.setQueryData<QueryData>(
                'profile.likes.posts',
                current => set(current, slug, condition, actionType),
            );

            queryClient.setQueryData<QueryData>(
                'profile.likes.comments',
                current => set(current, slug, condition, actionType),
            );
        },
        [],
    );

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
                            className='relative ml-auto'
                            queryKey='posts'
                            slug={slug}
                            edit={{
                                label: 'Edit post',
                                value: body,
                                placeholder: 'Edit post',
                                apiUrl: `/api/posts/${slug}`,
                            }}
                            delete={{
                                title: 'Confirmation to delete post',
                                message:
                                    'Are you sure you want to delete this post?',
                                apiUrl: `/api/posts/${slug}`,
                            }}
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
                    onSuccess={onSuccess}
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
                    onSuccess={onSuccess}
                />
            </section>
        </article>
    );
}

export default forwardRef(Post);
