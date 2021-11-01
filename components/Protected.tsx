import Head from 'next/head';
import { ChangeEvent, ReactNode, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { MdOutlineWbSunny, MdModeNight } from 'react-icons/md';
import clsx from 'clsx';
import useWindowSize from 'hooks/useWindowSize';
import useRendered from 'hooks/useRendered';
import Searchbar from './layouts/Searchbar';
import LeftSidebar from './layouts/LeftSidebar';
import RightSidebar from './layouts/RIghtSidebar';
import BottomNav from './layouts/BottomNav';
import Spinner from './vectors/Spinner';
import Logo from './Logo';

interface Props {
    title?: string;
    children: ReactNode;
}

function Protected({ title, children }: Props) {
    const [nightMode, setNightMode] = useState<boolean>(false);
    const rendered = useRendered();
    const windowSize = useWindowSize();
    const isDesktop = useMediaQuery({ minWidth: 1024 }, windowSize);
    const isMobile = useMediaQuery({ maxWidth: 480 }, windowSize);

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
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin
                />
                <link
                    href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
                    rel='stylesheet'
                />
                <title>{title}</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <header
                className={clsx(
                    'sticky top-[0] flex items-center bg-skin-bg py-sm px-lg drop-shadow-md z-10',
                    isMobile && 'gap-md',
                )}
            >
                <a className='no-underline' href='/' aria-label='Logo link'>
                    <Logo />
                </a>

                <Searchbar isMobile={isMobile} />

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
        </main>
    );
}

Protected.defaultProps = {
    title: 'Loading...',
};

export default Protected;
