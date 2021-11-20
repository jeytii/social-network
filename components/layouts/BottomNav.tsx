import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    MdOutlineHome,
    MdOutlineGroups,
    MdOutlineNotifications,
    MdAccountCircle,
    MdOutlineSettings,
} from 'react-icons/md';

export default function BottomNav() {
    const { route } = useRouter();
    const activeClass =
        'relative text-primary after:absolute after:w-full after:h-[5px] after:bg-primary after:left-[0px] after:bottom-[0px]';

    return (
        <nav className='sticky bottom-[0px] left-[0px] bg-skin-bg shadow-inner'>
            <div className='flex bg-skin-bg-contrast'>
                <Link href='/home'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/home' && activeClass,
                        )}
                    >
                        <MdOutlineHome className='text-lg m-auto' />
                    </span>
                </Link>

                <Link href='/'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/' && activeClass,
                        )}
                    >
                        <MdAccountCircle className='text-lg m-auto' />
                    </span>
                </Link>

                <Link href='/notifications'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/notifications' && activeClass,
                        )}
                    >
                        <MdOutlineNotifications className='text-lg m-auto' />
                    </span>
                </Link>

                <Link href='/search'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/search' && activeClass,
                        )}
                    >
                        <MdOutlineGroups className='text-lg m-auto' />
                    </span>
                </Link>

                <Link href='/settings'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/settings' && activeClass,
                        )}
                    >
                        <MdOutlineSettings className='text-lg m-auto' />
                    </span>
                </Link>
            </div>
        </nav>
    );
}
