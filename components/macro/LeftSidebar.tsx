import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import {
    MdHome,
    MdOutlineHome,
    MdThumbUp,
    MdOutlineThumbUp,
    MdBookmarks,
    MdOutlineBookmarks,
    MdAccountCircle,
    MdSettings,
    MdOutlineSettings,
} from 'react-icons/md';
import clsx from 'clsx';
import type { User } from 'types/user';

export default function LeftSidebar() {
    const isPortrait = useMediaQuery({ minWidth: 721 });
    const { route } = useRouter();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>('user');
    const isProfile = route === '/[username]' || route === '/edit-profile';
    const activeClass =
        'relative after:absolute after:w-[5px] after:h-full after:bg-primary after:left-[0px] after:top-[0px]';

    return (
        <aside className='w-[180px] sticky full-height left-[0px] bg-skin-main border-r border-skin-main md:w-auto'>
            <nav>
                <Link href='/home'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-main',
                            route === '/home' || route === '/post/[slug]'
                                ? [activeClass, 'text-primary']
                                : 'text-skin-secondary',
                        )}
                        aria-label='Home link'
                    >
                        {route === '/home' || route === '/post/[slug]' ? (
                            <MdHome className='text-xl' />
                        ) : (
                            <MdOutlineHome className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md text-md font-bold'>
                                Home
                            </span>
                        )}
                    </span>
                </Link>

                <Link href={`/${user?.username}`}>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md text-skin-secondary p-lg cursor-pointer hover:bg-skin-main',
                            isProfile && activeClass,
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
                            <span
                                className={clsx(
                                    'ml-md text-md font-bold',
                                    isProfile
                                        ? 'text-primary'
                                        : 'text-skin-secondary',
                                )}
                            >
                                Profile
                            </span>
                        )}
                    </span>
                </Link>

                <Link href='/likes?s=posts'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-main',
                            route === '/likes'
                                ? [activeClass, 'text-primary']
                                : 'text-skin-secondary',
                        )}
                        aria-label='Likes link'
                    >
                        {route === '/likes' ? (
                            <MdThumbUp className='text-xl' />
                        ) : (
                            <MdOutlineThumbUp className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md text-md font-bold'>
                                Likes
                            </span>
                        )}
                    </span>
                </Link>

                <Link href='/bookmarks'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-main',
                            route === '/bookmarks'
                                ? [activeClass, 'text-primary']
                                : 'text-skin-secondary',
                        )}
                        aria-label='Bookmarks link'
                    >
                        {route === '/bookmarks' ? (
                            <MdBookmarks className='text-xl' />
                        ) : (
                            <MdOutlineBookmarks className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md text-md font-bold'>
                                Bookmarks
                            </span>
                        )}
                    </span>
                </Link>

                <Link href='/settings'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-main',
                            route === '/settings'
                                ? [activeClass, 'text-primary']
                                : 'text-skin-secondary',
                        )}
                        aria-label='Settings link'
                    >
                        {route === '/settings' ? (
                            <MdSettings className='text-xl' />
                        ) : (
                            <MdOutlineSettings className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md text-md font-bold'>
                                Settings
                            </span>
                        )}
                    </span>
                </Link>
            </nav>
        </aside>
    );
}
