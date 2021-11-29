import { GetServerSideProps } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import clsx from 'clsx';
import ProfileHeadline from 'components/layouts/profile/Headline';
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
    posts_count: number;
    comments_count: number;
    followers_count: number;
    following_count: number;
    is_self: boolean;
    is_followed: boolean;
}

interface Props {
    invalid: boolean | undefined;
    user: ProfileInfo | undefined;
}

const Posts = dynamic(() => import('components/layouts/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

const Comments = dynamic(() => import('components/layouts/Comments'), {
    loading: () => <Spinner className='p-lg' />,
});

const Users = dynamic(() => import('components/layouts/Users'), {
    loading: () => <Spinner className='p-lg' />,
});

const isActive = (condition: boolean) =>
    condition
        ? 'relative text-primary after:absolute after:w-full after:h-[3px] after:bg-primary after:left-[0px] after:bottom-[0px]'
        : 'text-skin-text-light';

export default function Profile({ invalid, user }: Props) {
    const userData = useMemo(() => user, [user]);
    const {
        query: { s: section, username },
    } = useRouter();

    if (invalid || !userData) {
        return (
            <section className='p-lg text-center sm:px-md'>
                <h1 className='text-skin-text-light opacity-80'>
                    Oops! It looks like you&#39;re trying to redirect to an
                    unknown page.
                </h1>
            </section>
        );
    }

    return (
        <div>
            <ProfileHeadline {...userData} />

            <nav className='flex border-b border-skin-bg-contrast'>
                <Link href={`/${username}`} shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast md:text-sm sm:text-xs',
                            isActive(!section),
                        )}
                    >
                        <span className='block font-bold'>
                            {userData.posts_count}
                        </span>
                        <span>
                            {userData.posts_count > 1 ? 'Posts' : 'Post'}
                        </span>
                    </span>
                </Link>

                <Link href={`/${username}?s=comments`} shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast md:text-sm sm:text-xs',
                            isActive(section === 'comments'),
                        )}
                    >
                        <span className='block font-bold'>
                            {userData.comments_count}
                        </span>
                        <span>
                            {userData.comments_count > 1
                                ? 'Comments'
                                : 'Comment'}
                        </span>
                    </span>
                </Link>

                <Link href={`/${username}?s=followers`} shallow>
                    <div
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast md:text-sm sm:text-xs',
                            isActive(section === 'followers'),
                        )}
                    >
                        <span className='block font-bold'>
                            {userData.followers_count}
                        </span>
                        <span>
                            {userData.followers_count > 1
                                ? 'Followers'
                                : 'Follower'}
                        </span>
                    </div>
                </Link>

                <Link href={`/${username}?s=following`} shallow>
                    <div
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast md:text-sm sm:text-xs',
                            isActive(section === 'following'),
                        )}
                    >
                        <span className='block font-bold'>
                            {userData.following_count}
                        </span>
                        <span>Following</span>
                    </div>
                </Link>
            </nav>

            {!section && (
                <Posts
                    className='p-lg sm:px-md'
                    queryKey={['profile.posts', userData.slug]}
                    url={`/api/profile/${userData.username}/posts`}
                    cacheTime={1000 * 60 * 2}
                />
            )}

            {section === 'comments' && (
                <Comments
                    className='p-lg sm:px-md'
                    queryKey={['profile.comments', userData.slug]}
                    url={`/api/profile/${userData.username}/comments`}
                    cacheTime={1000 * 60 * 2}
                    hasLink
                />
            )}

            {section === 'followers' && (
                <Users
                    className='p-lg sm:px-md'
                    queryKey={['profile.followers', userData.slug]}
                    url={`/api/profile/${userData.username}/followers`}
                    cacheTime={1000 * 60 * 2}
                    enabled
                />
            )}

            {section === 'following' && (
                <Users
                    className='p-lg sm:px-md'
                    queryKey={['profile.following', userData.slug]}
                    url={`/api/profile/${userData.username}/following`}
                    cacheTime={1000 * 60 * 2}
                    enabled
                />
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    params,
    query,
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

        const props = {
            title: 'Not found',
            isPrivate: true,
            invalid: true,
        };

        try {
            const { data } = await axiosServer(req.cookies.token).get(
                `/api/profile/${params?.username}`,
            );

            const sections = ['comments', 'followers', 'following'];

            if (!!query.s && !sections.includes(query.s as string)) {
                return { props };
            }

            return {
                props: {
                    ...props,
                    title: data.data.name,
                    user: data.data,
                    invalid: false,
                },
            };
        } catch (e) {
            return { props };
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
