import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Cookies from 'js-cookie';
import ColorSelect from 'components/utilities/ColorSelect';
import { axiosClient, axiosServer } from 'config/axios';

interface User {
    slug: string;
    email: string;
    username: string;
    gender: string;
    image_url: string | null;
}

async function logout() {
    await axiosClient().post('/api/logout');

    Cookies.remove('token');

    window.location.href = '/';
}

export default function Settings({ user }: { user: User }) {
    return (
        <div className='p-lg'>
            <h1 className='text-md text-skin-secondary font-bold'>Settings</h1>

            <ColorSelect />

            <section className='flex items-center bg-skin-main rounded p-md mt-lg'>
                <div>
                    <span className='block text-md text-skin-secondary font-bold'>
                        Username
                    </span>
                    <span className='block text-md text-skin-primary'>
                        {user.username}
                    </span>
                </div>

                <Link href='/settings/username'>
                    <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <section className='flex items-center bg-skin-main rounded p-md mt-lg'>
                <div>
                    <span className='block text-md text-skin-secondary font-bold'>
                        Email address
                    </span>
                    <span className='block text-md text-skin-primary'>
                        {user.email}
                    </span>
                </div>

                <Link href='/settings/email-address'>
                    <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <section className='flex items-center bg-skin-main rounded p-md mt-lg'>
                <h3 className='block text-md text-skin-secondary font-bold'>
                    Password
                </h3>

                <Link href='/settings/password'>
                    <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <button
                className='inline-block text-md text-skin-secondary cursor-pointer mt-lg hover:text-skin-primary'
                type='button'
                onClick={logout}
            >
                Sign out
            </button>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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

        return {
            props: {
                title: 'Settings',
                isPrivate: true,
                user: responses[0].data.data,
                notificationsCount: responses[1].data.data,
            },
        };
    } catch (e) {
        return defaultReturn;
    }
};
