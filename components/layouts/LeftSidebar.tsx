import Link from 'next/link';
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
import useWindowSize from 'hooks/useWindowSize';
import { useRouter } from 'next/router';

export default function LeftSidebar() {
    const windowSize = useWindowSize();
    const isPortrait = useMediaQuery({ minWidth: 690 }, windowSize);
    const { route } = useRouter();

    return (
        <aside
            className={clsx(
                'sticky top-[59px] left-[0px] full-height bg-skin-bg-contrast-light',
                isPortrait ? 'w-[210px]' : 'auto',
            )}
        >
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

                <Link href='/'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-bg-contrast-light',
                            route === '/foo'
                                ? 'text-primary'
                                : 'text-skin-text-light',
                        )}
                        aria-label='Profile link'
                    >
                        <MdAccountCircle className='text-xl' />
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
