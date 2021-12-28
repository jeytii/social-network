import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import { InfiniteData, useQueryClient } from 'react-query';
import { MdOutlineChatBubbleOutline } from 'react-icons/md';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import MoreOptionsButton from 'components/utilities/MoreOptionsButton';
import LikeButton from 'components/chunks/LikeButton';
import type { Post as PostType } from 'types/post';
import { PostPage } from 'types/page';
import BookmarkButton from './BookmarkButton';

type Props = PostType & HTMLAttributes<HTMLElement>;
type QueryData = InfiniteData<PostPage> | undefined;

const update = (
    type: 'like' | 'bookmark',
    current: QueryData,
    slug: string,
    condition: boolean,
    count?: number,
) => {
    const posts = current?.pages.flatMap(page => [...page.items]);

    posts?.forEach(post => {
        if (post.slug === slug) {
            const p = post;

            if (type === 'like' && count !== undefined) {
                p.is_liked = condition;
                p.likes_count = count;
            }

            if (type === 'bookmark') {
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
    const queryKeys = [
        'posts',
        ['profile.posts', user.slug],
        'profile.likes.posts',
        'profile.bookmarks',
    ];

    function onLikeSuccess(condition: boolean, count: number) {
        queryKeys.forEach(key => {
            if (queryClient.getQueryData(key)) {
                queryClient.setQueryData<QueryData>(key, current =>
                    update('like', current, slug, condition, count),
                );
            }
        });
    }

    function onBookmarkSuccess(condition: boolean) {
        queryKeys.forEach(key => {
            if (queryClient.getQueryData(key)) {
                queryClient.setQueryData<QueryData>(key, current =>
                    update('bookmark', current, slug, condition),
                );
            }
        });
    }

    return (
        <article
            ref={ref}
            className={clsx('bg-skin-main rounded', className)}
            {...props}
        >
            <section className='p-md'>
                <div className={is_own_post ? 'flex items-center' : 'block'}>
                    <BasicInfo {...userProps} />

                    {(is_own_post || is_self) && (
                        <MoreOptionsButton
                            type='post'
                            parentSlug={user.slug}
                            slug={slug}
                            value={body}
                        />
                    )}
                </div>

                <p className='paragraph-md text-skin-primary my-sm clamp'>
                    {body}
                </p>

                <span className='text-skin-secondary text-sm xs:text-xs'>
                    {timestamp} {is_edited && '(edited)'}
                </span>
            </section>

            <section className='flex border-t border-primary-transparent rounded-b'>
                <LikeButton
                    className='flex-1 flex items-center justify-center text-center py-sm'
                    route={`/api/posts/${slug}`}
                    condition={is_liked}
                    count={likes_count}
                    onSuccess={onLikeSuccess}
                />

                <button
                    className='flex-1 flex items-center justify-center text-skin-secondary text-center py-sm hover:text-skin-primary'
                    type='button'
                >
                    <MdOutlineChatBubbleOutline size={15} />
                    <span className='text-sm ml-sm'>{comments_count}</span>
                </button>

                <BookmarkButton
                    route={`/api/posts/${slug}`}
                    condition={is_bookmarked}
                    onSuccess={onBookmarkSuccess}
                />
            </section>
        </article>
    );
}

export default forwardRef(Post);
