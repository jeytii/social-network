import { GetServerSideProps } from 'next';
import Link from 'next/link';
import axios from 'config/axios';
import Cookies from 'js-cookie';

export default function Settings() {
    async function logout() {
        await axios(Cookies.get('token')).post('/api/logout');

        Cookies.remove('token');
        Cookies.remove('user');

        window.location.href = '/';
    }

    return (
        <div className='p-lg'>
            <h1 className='text-md text-skin-text font-bold'>Settings</h1>

            <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-sm'>
                <div>
                    <span className='block text-md text-primary font-bold'>
                        Username
                    </span>
                    <span className='block text-md text-skin-text-light'>
                        john.doe
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
                    <span className='block text-md text-primary font-bold'>
                        Email address
                    </span>
                    <span className='block text-md text-skin-text-light'>
                        john.doe@email.com
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
                    <span className='block text-md text-primary font-bold'>
                        Phone number
                    </span>
                    <span className='block text-md text-skin-text-light'>
                        09123456789
                    </span>
                </div>

                <Link href='/settings/phone-number'>
                    <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                        Change
                    </span>
                </Link>
            </section>

            <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-lg'>
                <h3 className='block text-md text-primary font-bold'>
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
        await axios(req.cookies.token).get(`${process.env.APP_URL}/private`);

        return {
            props: {
                title: 'Settings',
                isPrivate: true,
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
