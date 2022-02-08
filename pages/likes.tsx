import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Spinner from 'components/vectors/Spinner';
import axios from 'lib/axios';

const Posts = dynamic(() => import('components/macro/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

const Comments = dynamic(() => import('components/macro/Comments'), {
    loading: () => <Spinner className='p-lg' />,
});

const isActive = (condition: boolean) =>
    condition
        ? 'bg-skin-main text-primary-dark font-bold rounded-full'
        : 'text-skin-secondary hover:text-primary-dark';

export default function Likes({ invalid }: { invalid: boolean | undefined }) {
    const { query } = useRouter();

    if (invalid) {
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
        <section>
            <nav className='flex border-b border-skin-main p-md'>
                <Link href='?s=posts' shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer',
                            isActive(query.s === 'posts'),
                        )}
                    >
                        Liked posts
                    </span>
                </Link>

                <Link href='?s=comments' shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer',
                            isActive(query.s === 'comments'),
                        )}
                    >
                        Liked comments
                    </span>
                </Link>
            </nav>

            {query.s === 'posts' && (
                <Posts
                    className='p-lg'
                    queryKey='profile.likes.posts'
                    url='/api/profile/likes/posts'
                    cacheTime={Infinity}
                    refetchInterval={1000 * 30}
                    refetchIntervalInBackground
                />
            )}

            {query.s === 'comments' && (
                <Comments
                    className='p-lg'
                    queryKey='profile.likes.comments'
                    url='/api/profile/likes/comments'
                    cacheTime={Infinity}
                    refetchInterval={1000 * 30}
                    refetchIntervalInBackground
                    hasLink
                />
            )}
        </section>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
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

        const sections = ['posts', 'comments'];
        const props = {
            title: 'Likes',
            isPrivate: true,
            user: responses[0].data.data,
            notificationsCount: responses[1].data.data,
        };

        if (!query.s) {
            return {
                redirect: {
                    destination: '?s=posts',
                    permanent: false,
                },
                props,
            };
        }

        if (!sections.includes(query.s as string)) {
            return {
                props: {
                    ...props,
                    title: '404: Not found',
                    invalid: true,
                },
            };
        }

        return { props };
    } catch (e) {
        return defaultReturn;
    }
};
