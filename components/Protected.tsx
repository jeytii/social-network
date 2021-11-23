import Head from 'next/head';
import { ChangeEvent, ReactNode, useState } from 'react';
import { useQueries, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { MdOutlineWbSunny, MdModeNight } from 'react-icons/md';
import useWindowSize from 'hooks/useWindowSize';
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

interface Props {
    title: string;
    children: ReactNode;
}

export default function Protected({ title, children }: Props) {
    const [nightMode, setNightMode] = useState<boolean>(false);
    const rendered = useRendered();
    const windowSize = useWindowSize();
    const isDesktop = useMediaQuery({ minWidth: 1024 }, windowSize);
    const isMobile = useMediaQuery({ maxWidth: 480 }, windowSize);
    const queryClient = useQueryClient();

    const [editPostModal, deletePostModal] = useQueries([
        {
            queryKey: 'edit',
            queryFn: () => queryClient.getQueryData('edit'),
            initialData: null,
        },
        {
            queryKey: 'delete',
            queryFn: () => queryClient.getQueryData('delete'),
            initialData: null,
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

            <section className='flex items-start'>
                {!isMobile && <LeftSidebar />}

                <section className='flex-1'>
                    {rendered ? children : <Spinner className='p-lg' />}
                </section>

                {isDesktop && <RightSidebar />}
            </section>

            {isMobile && <BottomNav />}

            {!!editPostModal.data && (
                <EditItemModal isOpen={!!editPostModal.data} />
            )}

            {!!deletePostModal.data && (
                <DeleteItemModal isOpen={!!deletePostModal.data} />
            )}
        </main>
    );
}
