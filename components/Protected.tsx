import Head from 'next/head';
import { ReactNode } from 'react';
import { useQueries, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import useRendered from 'hooks/useRendered';
import { axiosClient } from 'config/axios';
import type { ModifyItem } from 'types/item';
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

interface Props {
    title: string;
    notificationsCount: number;
    children: ReactNode;
}

export default function Protected({
    title,
    notificationsCount,
    children,
}: Props) {
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const isMobile = useMediaQuery({ maxWidth: 480 });
    const rendered = useRendered();
    const queryClient = useQueryClient();

    const [{ data: editItem }, { data: deleteItem }] = useQueries([
        {
            queryKey: 'edit',
            queryFn: () => queryClient.getQueryData<ModifyItem>('edit'),
        },
        {
            queryKey: 'delete',
            queryFn: () => queryClient.getQueryData<ModifyItem>('delete'),
        },
        {
            queryKey: 'notificationsCount',
            initialData: notificationsCount,
        },
        {
            queryKey: 'user',
            queryFn: async () => {
                const { data } = await axiosClient().get('/api/users/auth');

                return data.data;
            },
        },
    ]);

    return (
        <main className='h-screen overflow-auto'>
            <Head>
                <title>{title}</title>
            </Head>

            <div className='h-full overflow-auto sm:flex sm:flex-col'>
                {/* HEADER */}
                <header className='sticky top-[0px] bg-skin border-b border-skin-main z-10 drop-shadow'>
                    <div className='max-w-[1366px] flex items-center py-sm px-lg mx-auto sm:px-md sm:gap-md'>
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
