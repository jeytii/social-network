import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import {
    MdOutlineHome,
    MdOutlineGroups,
    MdOutlineNotifications,
    MdAccountCircle,
    MdOutlineSettings,
} from 'react-icons/md';
import clsx from 'clsx';
import useWindowSize from 'hooks/useWindowSize';

export default function LeftSidebar() {
    const windowSize = useWindowSize();
    const isPortrait = useMediaQuery({ minWidth: 690 }, windowSize);

    return (
        <aside
            className={clsx(
                'sticky top-[61px] left-[0px] full-height bg-skin-bg-contrast-light',
                isPortrait ? 'w-[200px]' : 'auto',
            )}
        >
            <nav>
                <Link href='/'>
                    <span
                        className='flex items-center no-underline bg-skin-bg-contrast-light text-primary text-sm p-lg cursor-pointer hover:bg-skin-bg-contrast-light'
                        aria-label='Home link'
                    >
                        <MdOutlineHome className='text-xl' />
                        {isPortrait && (
                            <span className='ml-lg font-semibold'>Home</span>
                        )}
                    </span>
                </Link>

                <Link href='/'>
                    <span
                        className='flex items-center no-underline text-skin-text-light text-sm p-lg cursor-pointer hover:bg-skin-bg-contrast-light'
                        aria-label='Profile link'
                    >
                        <MdAccountCircle className='text-xl' />
                        {isPortrait && (
                            <span className='ml-lg font-semibold'>Profile</span>
                        )}
                    </span>
                </Link>

                <Link href='/'>
                    <span
                        className='flex items-center no-underline text-skin-text-light text-sm p-lg cursor-pointer hover:bg-skin-bg-contrast-light'
                        aria-label='Notifications link'
                    >
                        <MdOutlineNotifications className='text-xl' />
                        {isPortrait && (
                            <span className='ml-lg font-semibold'>
                                Notifications
                            </span>
                        )}
                    </span>
                </Link>

                <Link href='/'>
                    <span
                        className='flex items-center no-underline text-skin-text-light text-sm p-lg cursor-pointer hover:bg-skin-bg-contrast-light'
                        aria-label='Search link'
                    >
                        <MdOutlineGroups className='text-xl' />
                        {isPortrait && (
                            <span className='ml-lg font-semibold'>
                                Search people
                            </span>
                        )}
                    </span>
                </Link>

                <Link href='/'>
                    <span
                        className='flex items-center no-underline text-skin-text-light text-sm p-lg cursor-pointer hover:bg-skin-bg-contrast-light'
                        aria-label='Settings link'
                    >
                        <MdOutlineSettings className='text-xl' />
                        {isPortrait && (
                            <span className='ml-lg font-semibold'>
                                Settings
                            </span>
                        )}
                    </span>
                </Link>
            </nav>
        </aside>
    );
}
