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

const Comments = dynamic(() => import('components/layouts/profile/Comments'), {
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
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            isActive(!section),
                        )}
                    >
                        Posts
                    </span>
                </Link>

                <Link href={`/${username}?s=comments`} shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            isActive(section === 'comments'),
                        )}
                    >
                        Comments
                    </span>
                </Link>
            </nav>

            {!section && (
                <Posts
                    className='p-lg sm:px-md'
                    queryKey={['profile.posts', user?.slug]}
                    url={`/api/profile/${user?.username}/posts`}
                    cacheTime={1000 * 60 * 2}
                    enabled
                />
            )}

            {section === 'comments' && <Comments />}
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
