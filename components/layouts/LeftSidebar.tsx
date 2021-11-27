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

                <Link href='/likes?s=posts'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-bg-contrast-light',
                            route === '/likes'
                                ? 'text-primary'
                                : 'text-skin-text-light',
                        )}
                        aria-label='Likes link'
                    >
                        {route === '/likes' ? (
                            <MdThumbUp className='text-xl' />
                        ) : (
                            <MdOutlineThumbUp className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md font-bold'>Likes</span>
                        )}
                    </span>
                </Link>

                <Link href='/bookmarks'>
                    <span
                        className={clsx(
                            'flex items-center no-underline text-md p-lg cursor-pointer hover:bg-skin-bg-contrast-light',
                            route === '/bookmarks'
                                ? 'text-primary'
                                : 'text-skin-text-light',
                        )}
                        aria-label='Bookmarks link'
                    >
                        {route === '/bookmarks' ? (
                            <MdBookmarks className='text-xl' />
                        ) : (
                            <MdOutlineBookmarks className='text-xl' />
                        )}

                        {isPortrait && (
                            <span className='ml-md font-bold'>Bookmarks</span>
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
