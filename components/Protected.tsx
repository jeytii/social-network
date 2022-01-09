import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, ReactNode } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import useRendered from 'hooks/useRendered';
import clsx from 'clsx';
import type { ModifyItem } from 'types/item';
import type { User } from 'types/user';
import DeletePostModal from './layouts/modal/DeletePost';
import DeleteCommentModal from './layouts/modal/DeleteComment';
import EditPostModal from './layouts/modal/EditPost';
import EditCommentModal from './layouts/modal/EditComment';
import Searchbar from './layouts/Searchbar';
import LeftSidebar from './layouts/LeftSidebar';
import RightSidebar from './layouts/right-sidebar';
import BottomNav from './layouts/BottomNav';
import NotificationBell from './utilities/NotificationBell';
import Spinner from './vectors/Spinner';
import Logo from './Logo';

type UserType = User & {
    dark_mode: boolean;
};

interface Props {
    user: UserType;
    title: string;
    notificationsCount: number;
    children: ReactNode;
}

export default function Protected({
    user,
    title,
    notificationsCount,
    children,
}: Props) {
    const bar = useRef<HTMLDivElement | null>(null);
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const isMobile = useMediaQuery({ maxWidth: 480 });
    const rendered = useRendered();
    const queryClient = useQueryClient();
    const { events } = useRouter();

    const { data: authUser } = useQuery<unknown, unknown, UserType>(
        'user',
        () => user,
    );

    const { data: editItem } = useQuery<unknown, unknown, ModifyItem>(
        'edit',
        () => queryClient.getQueryData('edit'),
    );

    const { data: deleteItem } = useQuery<unknown, unknown, ModifyItem>(
        'delete',
        () => queryClient.getQueryData('delete'),
    );

    useQuery('notificationsCount', {
        initialData: notificationsCount,
    });

    useEffect(() => {
        events.on('routeChangeStart', () => {
            bar.current?.classList.add('transition-[width]', 'duration-500');
            bar.current?.classList.replace('w-[0px]', 'w-[30%]');
        });

        events.on('routeChangeComplete', () => {
            bar.current?.classList.replace('w-[30%]', 'w-full');

            setTimeout(() => {
                bar.current?.classList.remove(
                    'transition-[width]',
                    'duration-500',
                );
                bar.current?.classList.replace('w-full', 'w-[0px]');
            }, 500);
        });
    }, []);

    return (
        <main
            className={clsx(
                'h-screen overflow-auto bg-skin',
                authUser?.dark_mode && 'dark',
            )}
        >
            <Head>
                <title>{title}</title>
            </Head>

            <div
                ref={bar}
                className='fixed top-[0px] left-[0px] w-[0px] h-[4px] bg-primary z-50'
            />

            <div className='h-full overflow-auto sm:flex sm:flex-col'>
                {/* HEADER */}
                <header className='sticky top-[0px] bg-skin z-10'>
                    <div className='max-w-[1366px] flex items-center bg-skin-main border-b border-skin-main py-sm px-lg mx-auto sm:px-md sm:gap-md'>
                        <a
                            className='no-underline'
                            href='/home'
                            aria-label='Logo link'
                        >
                            <Logo />
                        </a>

                        <Searchbar />

                        <NotificationBell />
                    </div>
                </header>

                {/* MAIN */}
                <section className='max-w-[1366px] flex items-start mx-auto sm:flex-1 sm:mx-[0px]'>
                    {!isMobile && <LeftSidebar />}

                    <section className='flex-1'>
                        {rendered ? children : <Spinner className='p-lg' />}
                    </section>

                    {isDesktop && <RightSidebar />}
                </section>

                {/* BOTTOM NAV (mobile mode) */}
                {isMobile && <BottomNav />}

                {/* Modal for editing a post */}
                {editItem && editItem.type === 'post' && (
                    <EditPostModal
                        isOpen={editItem && editItem.type === 'post'}
                    />
                )}

                {/* Modal for editing a comment */}
                {editItem && editItem.type === 'comment' && (
                    <EditCommentModal
                        isOpen={editItem && editItem.type === 'comment'}
                    />
                )}

                {/* Confirmation modal for deleting a post */}
                {deleteItem && deleteItem.type === 'post' && (
                    <DeletePostModal
                        isOpen={deleteItem && deleteItem.type === 'post'}
                    />
                )}

                {/* Confirmation modal for deleting a comment */}
                {deleteItem && deleteItem.type === 'comment' && (
                    <DeleteCommentModal
                        isOpen={deleteItem && deleteItem.type === 'comment'}
                    />
                )}
            </div>
        </main>
    );
}
