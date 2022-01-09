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
    currentUser: ProfileInfo | undefined;
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
        ? 'bg-skin-main rounded-full text-primary-dark'
        : 'text-skin-secondary hover:text-primary-dark';

export default function Profile({ invalid, currentUser }: Props) {
    const userData = useMemo(() => currentUser, [currentUser]);
    const {
        query: { s: section, username },
    } = useRouter();

    if (invalid || !userData) {
        return (
            <section className='p-lg text-center sm:px-md'>
                <h1 className='text-skin-secondary opacity-80'>
                    Oops! It looks like you&#39;re trying to redirect to an
                    unknown page.
                </h1>
            </section>
        );
    }

    return (
        <div className='p-lg sm:px-md'>
            <ProfileHeadline {...userData} />

            <nav className='flex rounded py-lg'>
                <Link href={`/${username}`} shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-xs cursor-pointer md:text-sm sm:text-xs',
                            isActive(!section),
                        )}
                    >
                        <span className='font-bold'>Posts</span>
                        <span className='block'>{userData.posts_count}</span>
                    </span>
                </Link>

                <Link href={`/${username}?s=comments`} shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-xs cursor-pointer md:text-sm sm:text-xs',
                            isActive(section === 'comments'),
                        )}
                    >
                        <span className='font-bold'>Comments</span>
                        <span className='block'>{userData.comments_count}</span>
                    </span>
                </Link>

                <Link href={`/${username}?s=followers`} shallow>
                    <div
                        className={clsx(
                            'flex-1 text-md text-center py-xs cursor-pointer md:text-sm sm:text-xs',
                            isActive(section === 'followers'),
                        )}
                    >
                        <span className='font-bold'>Followers</span>

                        <span className='block'>
                            {userData.followers_count}
                        </span>
                    </div>
                </Link>

                <Link href={`/${username}?s=following`} shallow>
                    <div
                        className={clsx(
                            'flex-1 text-md text-center py-xs cursor-pointer md:text-sm sm:text-xs',
                            isActive(section === 'following'),
                        )}
                    >
                        <span className='font-bold'>Following</span>

                        <span className='block'>
                            {userData.following_count}
                        </span>
                    </div>
                </Link>
            </nav>

            {!section && (
                <Posts
                    queryKey={['profile.posts', userData.slug]}
                    url={`/api/profile/${userData.username}/posts`}
                    cacheTime={1000 * 60 * 2}
                    refetchInterval={1000 * 30}
                    refetchIntervalInBackground
                />
            )}

            {section === 'comments' && (
                <Comments
                    queryKey={['profile.comments', userData.slug]}
                    url={`/api/profile/${userData.username}/comments`}
                    cacheTime={1000 * 60 * 2}
                    refetchInterval={1000 * 30}
                    refetchIntervalInBackground
                    hasLink
                />
            )}

            {section === 'followers' && (
                <Users
                    queryKey={['profile.followers', userData.slug]}
                    url={`/api/profile/${userData.username}/followers`}
                    cacheTime={1000 * 60 * 2}
                    refetchInterval={1000 * 30}
                    refetchIntervalInBackground
                />
            )}

            {section === 'following' && (
                <Users
                    queryKey={['profile.following', userData.slug]}
                    url={`/api/profile/${userData.username}/following`}
                    cacheTime={1000 * 60 * 2}
                    refetchInterval={1000 * 30}
                    refetchIntervalInBackground
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
    const defaultReturn = {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };

    if (!req.cookies || !req.cookies.token) {
        return defaultReturn;
    }

    try {
        const responses = await Promise.all([
            axiosServer(req.cookies.token).get('/private'),
            axiosServer(req.cookies.token).get('/api/notifications/count'),
        ]);

        const errorProps = {
            title: 'Not found',
            isPrivate: true,
            invalid: true,
            user: responses[0].data.data,
            notificationsCount: responses[1].data.data,
        };

        try {
            const { data } = await axiosServer(req.cookies.token).get(
                `/api/profile/${params?.username}`,
            );

            const sections = ['comments', 'followers', 'following'];

            if (!!query.s && !sections.includes(query.s as string)) {
                return { props: errorProps };
            }

            return {
                props: {
                    ...errorProps,
                    title: data.data.name,
                    currentUser: data.data,
                    invalid: false,
                },
            };
        } catch (e) {
            return { props: errorProps };
        }
    } catch (e) {
        return defaultReturn;
    }
};
