import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useQueries, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { MdOutlineNotifications } from 'react-icons/md';
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
import Spinner from './vectors/Spinner';
import Logo from './Logo';

interface Props {
    title: string;
    children: ReactNode;
}

export default function Protected({ title, children }: Props) {
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
            queryKey: 'user',
            queryFn: async () => {
                const { data } = await axiosClient().get('/api/users/auth');

                return data.data;
            },
        },
    ]);

    return (
        <main className='bg-skin-bg h-screen overflow-auto'>
            <Head>
                <title>
                    {title} - {process.env.NEXT_PUBLIC_APP_NAME}
                </title>
            </Head>

            {/* HEADER */}
            <header className='sticky top-[0px] flex items-center bg-skin-bg py-sm px-lg drop-shadow-md z-10 sm:px-md sm:gap-md'>
                <a className='no-underline' href='/home' aria-label='Logo link'>
                    <Logo />
                </a>

                <Searchbar />

                <Link href='/notifications'>
                    <div className='relative cursor-pointer ml-auto'>
                        <span className='absolute top-[-11px] right-[-9px] w-[20px] h-[20px] flex items-center justify-center bg-danger text-xs rounded-full p-xs'>
                            9+
                        </span>

                        <MdOutlineNotifications
                            className='text-skin-text-light text-lg'
                            viewBox='2 2 20 20'
                        />
                    </div>
                </Link>
            </header>

            {/* MAIN */}
            <section className='flex items-start'>
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
                <EditPostModal isOpen={editItem && editItem.type === 'post'} />
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
        </main>
    );
}
