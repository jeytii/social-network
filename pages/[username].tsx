import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, lazy, Suspense } from 'react';
import clsx from 'clsx';
import ProfileHeadline from 'components/macro/profile/Headline';
import Spinner from 'components/utilities/Spinner';
import axios from 'lib/axios';

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

const Posts = lazy(() => import('components/macro/Posts'));
const Comments = lazy(() => import('components/macro/Comments'));
const Users = lazy(() => import('components/macro/Users'));

const isActive = (condition: boolean) =>
    condition
        ? 'bg-skin-main rounded-full text-primary-dark border-skin-main'
        : 'text-skin-secondary hover:text-primary-dark border-[transparent]';

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

            <nav className='flex rounded py-lg sm:gap-xs'>
                <Link href={`/${username}`} shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center border py-xs cursor-pointer md:text-sm sm:text-xs',
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
                            'flex-1 text-md text-center border py-xs cursor-pointer md:text-sm sm:text-xs',
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
                            'flex-1 text-md text-center border py-xs cursor-pointer md:text-sm sm:text-xs',
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
                            'flex-1 text-md text-center border py-xs cursor-pointer md:text-sm sm:text-xs',
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
                <Suspense fallback={<Spinner className='p-lg' />}>
                    <Posts
                        queryKey={['profile.posts', userData.slug]}
                        url={`/api/profile/${userData.username}/posts`}
                        cacheTime={1000 * 60 * 2}
                        refetchInterval={1000 * 30}
                        refetchIntervalInBackground
                    />
                </Suspense>
            )}

            {section === 'comments' && (
                <Suspense fallback={<Spinner className='p-lg' />}>
                    <Comments
                        queryKey={['profile.comments', userData.slug]}
                        url={`/api/profile/${userData.username}/comments`}
                        cacheTime={1000 * 60 * 2}
                        refetchInterval={1000 * 30}
                        refetchIntervalInBackground
                        hasLink
                    />
                </Suspense>
            )}

            {section === 'followers' && (
                <Suspense fallback={<Spinner className='p-lg' />}>
                    <Users
                        queryKey={['profile.followers', userData.slug]}
                        url={`/api/profile/${userData.username}/followers`}
                        cacheTime={1000 * 60 * 2}
                        refetchInterval={1000 * 30}
                        refetchIntervalInBackground
                    />
                </Suspense>
            )}

            {section === 'following' && (
                <Suspense fallback={<Spinner className='p-lg' />}>
                    <Users
                        queryKey={['profile.following', userData.slug]}
                        url={`/api/profile/${userData.username}/following`}
                        cacheTime={1000 * 60 * 2}
                        refetchInterval={1000 * 30}
                        refetchIntervalInBackground
                    />
                </Suspense>
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
            axios(req.cookies.token).get('/private'),
            axios(req.cookies.token).get('/api/notifications/count'),
        ]);

        const errorProps = {
            title: 'Not found',
            isPrivate: true,
            invalid: true,
            user: responses[0].data.data,
            notificationsCount: responses[1].data.data,
        };

        try {
            const { data } = await axios(req.cookies.token).get(
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
