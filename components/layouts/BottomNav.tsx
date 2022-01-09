import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQueryClient } from 'react-query';
import {
    MdOutlineHome,
    MdOutlineThumbUp,
    MdOutlineBookmarks,
    MdAccountCircle,
    MdOutlineSettings,
} from 'react-icons/md';
import clsx from 'clsx';
import { User } from 'types/user';

export default function BottomNav() {
    const { route } = useRouter();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>('user');
    const isHome = route === '/home' || route === '/post/[slug]';
    const isProfile = route === '/[username]' || route === '/edit-profile';
    const activeClass =
        'relative text-primary after:absolute after:w-full after:h-[5px] after:bg-primary after:left-[0px] after:bottom-[0px]';

    return (
        <nav className='sticky bottom-[0px] left-[0px] bg-skin border-t border-skin-main'>
            <div className='flex bg-skin-main border-t border-skin-main'>
                <Link href='/home'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-secondary cursor-pointer',
                            isHome && activeClass,
                        )}
                    >
                        <MdOutlineHome className='m-auto' size={20} />
                    </span>
                </Link>

                <Link href={`/${user?.username}`}>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-secondary cursor-pointer',
                            isProfile && activeClass,
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

                <Link href='/likes?s=posts'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-secondary cursor-pointer',
                            route === '/likes' && activeClass,
                        )}
                    >
                        <MdOutlineThumbUp className='m-auto' size={20} />
                    </span>
                </Link>

                <Link href='/bookmarks'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-secondary cursor-pointer',
                            route === '/bookmarks' && activeClass,
                        )}
                    >
                        <MdOutlineBookmarks className='m-auto' size={20} />
                    </span>
                </Link>

                <Link href='/settings'>
                    <span
                        className={clsx(
                            'flex-1 py-md text-skin-secondary cursor-pointer',
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
