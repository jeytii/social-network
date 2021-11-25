import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import {
    MdHome,
    MdOutlineHome,
    MdGroups,
    MdOutlineGroups,
    MdNotifications,
    MdOutlineNotifications,
    MdAccountCircle,
    MdSettings,
    MdOutlineSettings,
} from 'react-icons/md';
import clsx from 'clsx';
import { User } from 'types/user';

export default function LeftSidebar() {
    const isPortrait = useMediaQuery({ minWidth: 721 });
    const { route } = useRouter();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>('user');

    return (
        <aside className='w-[200px] sticky full-height left-[0px] bg-skin-bg-contrast-light md:w-auto'>
            <nav>
                <Link href='/home'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-bg-contrast-light',
                            route === '/home'
                                ? 'text-primary'
                                : 'text-skin-text-light',
                        )}
                        aria-label='Home link'
                    >
                        {route === '/home' ? (
                            <MdHome className='text-xl' />
                        ) : (
                            <MdOutlineHome className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md font-bold'>Home</span>
                        )}
                    </span>
                </Link>

                <Link href={`/${user?.username}`}>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-bg-contrast-light',
                            route === '/foo'
                                ? 'text-primary'
                                : 'text-skin-text-light',
                        )}
                        aria-label='Profile link'
                    >
                        {user?.image_url ? (
                            <Image
                                src={user?.image_url}
                                width={24}
                                height={24}
                            />
                        ) : (
                            <MdAccountCircle className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md font-bold'>Profile</span>
                        )}
                    </span>
                </Link>

                <Link href='/notifications'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-bg-contrast-light',
                            route === '/notifications'
                                ? 'text-primary'
                                : 'text-skin-text-light',
                        )}
                        aria-label='Notifications link'
                    >
                        {route === '/notifications' ? (
                            <MdNotifications className='text-xl' />
                        ) : (
                            <MdOutlineNotifications className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md font-bold'>
                                Notifications
                            </span>
                        )}
                    </span>
                </Link>

                <Link href='/search'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-bg-contrast-light',
                            route === '/search'
                                ? 'text-primary'
                                : 'text-skin-text-light',
                        )}
                        aria-label='Search link'
                    >
                        {route === '/search' ? (
                            <MdGroups className='text-xl' />
                        ) : (
                            <MdOutlineGroups className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md font-bold'>
                                Search people
                            </span>
                        )}
                    </span>
                </Link>

                <Link href='/settings'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-bg-contrast-light',
                            route === '/settings'
                                ? 'text-primary'
                                : 'text-skin-text-light',
                        )}
                        aria-label='Settings link'
                    >
                        {route === '/settings' ? (
                            <MdSettings className='text-xl' />
                        ) : (
                            <MdOutlineSettings className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md font-bold'>Settings</span>
                        )}
                    </span>
                </Link>
            </nav>
        </aside>
    );
}
