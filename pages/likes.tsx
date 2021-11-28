import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Spinner from 'components/vectors/Spinner';
import { axiosServer } from 'config/axios';

const Posts = dynamic(() => import('components/layouts/Posts'), {
    loading: () => <Spinner className='p-lg' />,
});

const Comments = dynamic(() => import('components/layouts/Comments'), {
    loading: () => <Spinner className='p-lg' />,
});

const isActive = (condition: boolean) =>
    condition
        ? 'relative text-primary after:absolute after:w-full after:h-[3px] after:bg-primary after:left-[0px] after:bottom-[0px]'
        : 'text-skin-text-light';

export default function Likes({ invalid }: { invalid: boolean | undefined }) {
    const { query } = useRouter();

    if (invalid) {
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
        <section>
            <nav className='flex'>
                <Link href='?s=posts' shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            isActive(query.s === 'posts'),
                        )}
                    >
                        Liked posts
                    </span>
                </Link>

                <Link href='?s=comments' shallow>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
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
                    enabled
                />
            )}

            {query.s === 'comments' && (
                <Comments
                    queryKey='profile.likes.comments'
                    url='/api/profile/likes/comments'
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
    if (!req.cookies || !req.cookies.token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        await axiosServer(req.cookies.token).get('/private');

        const sections = ['posts', 'comments'];
        const props = {
            title: 'Likes',
            isPrivate: true,
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
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};
