import { GetServerSideProps } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import {
    MdLibraryBooks,
    MdThumbUp,
    MdForum,
    MdBookmarks,
} from 'react-icons/md';
import clsx from 'clsx';
import ProfileHeadline from 'components/layouts/profile/Headline';
import ProfileSectionNotFound from 'components/layouts/profile/NotFound';
import Spinner from 'components/vectors/Spinner';
import { axiosServer } from 'config/axios';

interface ProfileInfo {
    slug: string;
    name: string;
    username: string;
    birth_date: string;
    created_at: string;
    bio: string;
    image_url: string | null;
    followers_count: number;
    following_count: number;
    is_self: boolean;
    is_followed: boolean;
}

const Posts = dynamic(() => import('components/layouts/profile/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

const Likes = dynamic(() => import('components/layouts/profile/Likes'), {
    loading: () => <Spinner className='p-lg' />,
});

const Comments = dynamic(() => import('components/layouts/profile/Comments'), {
    loading: () => <Spinner className='p-lg' />,
});

const Bookmarks = dynamic(
    () => import('components/layouts/profile/Bookmarks'),
    {
        loading: () => <Spinner className='p-lg' />,
    },
);

export default function Profile({ user }: { user: ProfileInfo | null }) {
    const isLandscapeTablet = useMediaQuery({ maxWidth: 720 });
    const { query, asPath } = useRouter();
    const { username, sections } = query;
    const section = Array.isArray(sections) ? sections.join('/') : null;

    const stateClass = (condition: boolean) =>
        condition ? 'text-primary' : 'text-skin-text-light';

    if (!user) {
        return <h1>User not found</h1>;
    }

    if (!!section && !/^likes|comments|bookmarks$/.test(section)) {
        return <ProfileSectionNotFound />;
    }

    return (
        <div>
            <ProfileHeadline {...user} />

            <nav className='flex border-b border-skin-bg-contrast'>
                <Link href={`/${username}`}>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            stateClass(asPath === `/${username}`),
                        )}
                    >
                        {isLandscapeTablet ? (
                            <MdLibraryBooks className='block m-auto' />
                        ) : (
                            'Posts'
                        )}
                    </span>
                </Link>

                <Link href={`/${username}/likes`}>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            stateClass(asPath === `/${username}/likes`),
                        )}
                    >
                        {isLandscapeTablet ? (
                            <MdThumbUp className='block m-auto' />
                        ) : (
                            'Likes'
                        )}
                    </span>
                </Link>

                <Link href={`/${username}/comments`}>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            stateClass(asPath === `/${username}/comments`),
                        )}
                    >
                        {isLandscapeTablet ? (
                            <MdForum className='block m-auto' />
                        ) : (
                            'Comments'
                        )}
                    </span>
                </Link>

                <Link href={`/${username}/bookmarks`}>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            stateClass(asPath === `/${username}/bookmarks`),
                        )}
                    >
                        {isLandscapeTablet ? (
                            <MdBookmarks className='block m-auto' />
                        ) : (
                            'Bookmarks'
                        )}
                    </span>
                </Link>
            </nav>

            {asPath === `/${username}` && <Posts />}
            {asPath === `/${username}/likes` && <Likes />}
            {asPath === `/${username}/comments` && <Comments />}
            {asPath === `/${username}/bookmarks` && <Bookmarks />}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    params,
}) => {
    if (!req.cookies || !req.cookies.token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        axiosServer(req.cookies.token).get('/private');

        try {
            const { data } = await axiosServer(req.cookies.token).get(
                `/api/profile/${params?.username}`,
            );

            return {
                props: {
                    title: data.data.name,
                    isPrivate: true,
                    user: data.data,
                },
            };
        } catch (e) {
            return {
                props: {
                    title: 'Not found',
                    isPrivate: true,
                    user: null,
                },
            };
        }
    } catch (e) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};
