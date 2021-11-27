import Link from 'next/link';
import { useInfiniteQuery, InfiniteData } from 'react-query';
import Post from 'components/chunks/post';
import Spinner from 'components/vectors/Spinner';
import { PostPage } from 'types/page';
import { Post as PostType } from 'types/post';
import clsx from 'clsx';

interface Props {
    userSlug: string;
    username: string;
}

const formatData = ({ pageParams, pages }: InfiniteData<PostPage>) => {
    if (pages.length === 1) {
        return {
            pageParams,
            pages: pages[0].items,
        };
    }

    if (pages.length > 1) {
        return {
            pageParams,
            pages: pages.flatMap(page => [...page.items]),
        };
    }

    return { pageParams, pages: [] };
};

export default function Posts({ userSlug, username }: Props) {
    const { data, isLoading, isSuccess } = useInfiniteQuery<
        PostPage,
        unknown,
        PostType
    >(['profile.posts', userSlug], {
        meta: {
            url: `/api/profile/${username}/posts`,
        },
        getNextPageParam: last => last.next_offset ?? false,
        select: formatData,
        cacheTime: 1000 * 60 * 2,
    });

    if (isLoading || !data) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data.pages.length) {
        return (
            <section className='p-lg sm:px-md'>
                <h1 className='text-md text-skin-text-light text-center'>
                    No posts to show.
                </h1>
            </section>
        );
    }

    return (
        <section className='p-lg sm:px-md'>
            {data.pages.map((post, index) => (
                <Link key={post.slug} href={`/post/${post.slug}`}>
                    <Post
                        className={clsx('cursor-pointer', !!index && 'mt-lg')}
                        {...post}
                    />
                </Link>
            ))}
        </section>
    );
}
