import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { axiosServer } from 'config/axios';
import Posts from 'components/layouts/Posts';

export default function Likes({ show }: { show: boolean }) {
    const { query } = useRouter();
    const stateClass = (condition: boolean) =>
        condition
            ? 'relative text-primary after:absolute after:w-full after:h-[3px] after:bg-primary after:left-[0px] after:bottom-[0px]'
            : 'text-skin-text-light';

    if (!show) {
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
                <Link href='/likes?s=posts'>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            stateClass(query.s === 'posts'),
                        )}
                    >
                        Liked posts
                    </span>
                </Link>

                <Link href='/likes?s=comments'>
                    <span
                        className={clsx(
                            'flex-1 text-md text-center py-sm cursor-pointer hover:bg-skin-bg-contrast',
                            stateClass(query.s === 'comments'),
                        )}
                    >
                        Liked comments
                    </span>
                </Link>
            </nav>

            {query.s === 'posts' && (
                <section className='p-lg'>
                    <h1>Liked Posts</h1>
                </section>
            )}

            {query.s === 'comments' && (
                <section className='p-lg'>
                    <h1>Liked Comments</h1>
                </section>
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

        const validRoute = query.s === 'posts' || query.s === 'comments';

        return {
            props: {
                title: validRoute ? 'Likes' : '404: Not found',
                isPrivate: true,
                show: validRoute,
            },
        };
    } catch (e) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};
