import Head from 'next/head';
import { ChangeEvent, ReactNode, useState } from 'react';
import { useQueries, useQueryClient, QueryKey } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { MdOutlineWbSunny, MdModeNight } from 'react-icons/md';
import useRendered from 'hooks/useRendered';
import { axiosClient } from 'config/axios';
import EditItemModal from 'components/layouts/modal/EditItem';
import DeleteItemModal from 'components/layouts/modal/DeleteItem';
import Searchbar from './layouts/Searchbar';
import LeftSidebar from './layouts/LeftSidebar';
import RightSidebar from './layouts/right-sidebar';
import BottomNav from './layouts/BottomNav';
import Spinner from './vectors/Spinner';
import Logo from './Logo';

interface EditItem {
    queryKey: QueryKey;
    slug: string;
    label: string;
    value: string;
    placholder: string;
    apiUrl: string;
}

interface DeleteItem {
    queryKey: QueryKey;
    slug: string;
    title: string;
    message: string;
    apiUrl: string;
}

interface Props {
    title: string;
    children: ReactNode;
}

export default function Protected({ title, children }: Props) {
    const [nightMode, setNightMode] = useState<boolean>(false);
    const rendered = useRendered();
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const isMobile = useMediaQuery({ maxWidth: 480 });
    const queryClient = useQueryClient();

    const [{ data: editPostModal }, { data: deletePostModal }] = useQueries([
        {
            queryKey: 'edit',
            queryFn: () => queryClient.getQueryData<EditItem>('edit'),
        },
        {
            queryKey: 'delete',
            queryFn: () => queryClient.getQueryData<DeleteItem>('delete'),
        },
        {
            queryKey: 'user',
            queryFn: async () => {
                const { data } = await axiosClient().get('/api/users/auth');

                return data.data;
            },
        },
    ]);

    function toggleDarkMode(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target;

        setNightMode(checked);

        if (checked) {
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.remove('theme-dark');
        }
    }

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

                <label
                    className='cursor-pointer ml-auto'
                    htmlFor='theme-toggler'
                    title='Toggle theme'
                    aria-label='Toggle theme'
                >
                    <input
                        className='hidden'
                        type='checkbox'
                        id='theme-toggler'
                        onChange={toggleDarkMode}
                    />

                    {nightMode ? (
                        <MdModeNight className='text-skin-text-light text-lg' />
                    ) : (
                        <MdOutlineWbSunny className='text-skin-text-light text-lg' />
                    )}
                </label>
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

            {/* Modal for editing a post or comment */}
            {editPostModal && <EditItemModal isOpen={!!editPostModal} />}

            {/* Modal for confirming the deletion of a post or comment */}
            {deletePostModal && <DeleteItemModal isOpen={!!deletePostModal} />}
        </main>
    );
}
