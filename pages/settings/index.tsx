import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { Switch } from '@headlessui/react';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import { axiosClient, axiosServer } from 'config/axios';

interface User {
    slug: string;
    email: string;
    username: string;
    phone_number: string;
    gender: string;
    image_url: string | null;
}

export default function Settings({ user }: { user: User }) {
    const [enabled, setEnabled] = useState(false);

    async function logout() {
        await axiosClient().post('/api/logout');

        Cookies.remove('token');

        window.location.href = '/';
    }

    return (
        <div className='p-lg'>
            <h1 className='text-md text-skin-text font-bold'>Settings</h1>

            <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-sm'>
                <h3 className='block text-md text-skin-text-light font-bold'>
                    Dark mode
                </h3>

                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={clsx(
                        'relative inline-flex flex-shrink-0 h-[27px] w-[50px] border border-skin-bg-contrast rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 ml-auto',
                        enabled
                            ? 'bg-primary-light'
                            : 'bg-skin-bg-contrast-light',
                    )}
                >
                    <span className='sr-only'>Use setting</span>
                    <span
                        aria-hidden='true'
                        className={clsx(
                            'pointer-events-none inline-block h-[25px] w-[25px] rounded-full bg-skin-bg shadow-lg transform ring-0 transition ease-in-out duration-200',
                            enabled ? 'translate-x-[92%]' : 'translate-x-[0px]',
                        )}
                    />
                </Switch>
            </section>

            <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-lg'>
                <div>
                    <span className='block text-md text-skin-text-light font-bold'>
                        Username
                    </span>
                    <span className='block text-md text-skin-text'>
                        {user.username}
                    </span>
                </div>

                <Link href='/settings/username'>
                    <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-lg'>
                <div>
                    <span className='block text-md text-skin-text-light font-bold'>
                        Email address
                    </span>
                    <span className='block text-md text-skin-text'>
                        {user.email}
                    </span>
                </div>

                <Link href='/settings/email-address'>
                    <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-lg'>
                <div>
                    <span className='block text-md text-skin-text-light font-bold'>
                        Phone number
                    </span>
                    <span className='block text-md text-skin-text'>
                        {user.phone_number}
                    </span>
                </div>

                <Link href='/settings/phone-number'>
                    <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-lg'>
                <h3 className='block text-md text-skin-text-light font-bold'>
                    Password
                </h3>

                <Link href='/settings/password'>
                    <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <button
                className='inline-block text-sm text-skin-text-light cursor-pointer mt-lg hover:text-skin-text'
                type='button'
                onClick={logout}
            >
                Logout
            </button>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    if (!req.cookies || !req.cookies.token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        const { data } = await axiosServer(req.cookies.token).get('/private');

        return {
            props: {
                title: 'Settings',
                isPrivate: true,
                user: data.user,
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
