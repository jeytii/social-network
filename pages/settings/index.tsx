import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Cookies from 'js-cookie';
import DarkModeToggler from 'components/micro/DarkModeToggler';
import axios from 'lib/axios';
import authenticate from 'lib/auth';

interface User {
    slug: string;
    email: string;
    username: string;
    gender: string;
    image_url: string | null;
    dark_mode: boolean;
}

async function logout() {
    await axios().post('/api/logout');

    Cookies.remove('token');

    window.location.href = '/';
}

export default function Settings({ user }: { user: User }) {
    return (
        <div className='p-lg'>
            <section className='flex items-center bg-skin-main border border-skin-main rounded p-md'>
                <h3 className='block text-md text-skin-secondary font-bold'>
                    Dark Mode
                </h3>

                <DarkModeToggler className='ml-auto' checked={user.dark_mode} />
            </section>

            <section className='flex items-center bg-skin-main border border-skin-main rounded p-md mt-lg'>
                <div>
                    <span className='block text-md text-skin-secondary font-bold'>
                        Username
                    </span>
                    <span className='block text-md text-skin-primary'>
                        {user.username}
                    </span>
                </div>

                <Link href='/settings/username'>
                    <span className='text-sm text-primary font-bold cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <section className='flex items-center bg-skin-main border border-skin-main rounded p-md mt-lg'>
                <div>
                    <span className='block text-md text-skin-secondary font-bold'>
                        Email address
                    </span>
                    <span className='block text-md text-skin-primary'>
                        {user.email}
                    </span>
                </div>

                <Link href='/settings/email-address'>
                    <span className='text-sm text-primary font-bold cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <section className='flex items-center bg-skin-main border border-skin-main rounded p-md mt-lg'>
                <h3 className='block text-md text-skin-secondary font-bold'>
                    Password
                </h3>

                <Link href='/settings/password'>
                    <span className='text-sm text-primary font-bold cursor-pointer ml-auto hover:text-primary-dark'>
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

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('auth', props, {
        title: 'Settings',
    });
