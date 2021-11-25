import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQueryClient } from 'react-query';
import {
    MdOutlineHome,
    MdOutlineGroups,
    MdOutlineNotifications,
    MdAccountCircle,
    MdOutlineSettings,
} from 'react-icons/md';
import clsx from 'clsx';
import { User } from 'types/user';

export default function BottomNav() {
    const { route } = useRouter();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>('user');
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
                        <MdOutlineHome className='m-auto' size={20} />
                    </span>
                </Link>

                <Link href={`/${user?.username}`}>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/' && activeClass,
                        )}
                    >
                        {user?.image_url ? (
                            <Image
                                src={user?.image_url}
                                width={20}
                                height={20}
                            />
                        ) : (
                            <MdAccountCircle className='m-auto' size={20} />
                        )}
                    </span>
                </Link>

                <Link href='/notifications'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/notifications' && activeClass,
                        )}
                    >
                        <MdOutlineNotifications className='m-auto' size={20} />
                    </span>
                </Link>

                <Link href='/search'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/search' && activeClass,
                        )}
                    >
                        <MdOutlineGroups className='m-auto' size={20} />
                    </span>
                </Link>

                <Link href='/settings'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-text-light cursor-pointer',
                            route === '/settings' && activeClass,
                        )}
                    >
                        <MdOutlineSettings className='m-auto' size={20} />
                    </span>
                </Link>
            </div>
        </nav>
    );
}
