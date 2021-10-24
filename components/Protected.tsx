import { ChangeEvent, ReactNode, useState } from 'react';
import Head from 'next/head';
import { useMediaQuery } from 'react-responsive';
import { MdOutlineWbSunny, MdModeNight } from 'react-icons/md';
import clsx from 'clsx';
import Searchbar from './layouts/Searchbar';
import LeftSidebar from './layouts/LeftSidebar';
import RightSidebar from './layouts/RIghtSidebar';
import BottomNav from './chunks/BottomNav';
import Logo from './Logo';

interface Props {
    title: string;
    children: ReactNode;
}

export default function Protected({ title, children }: Props) {
    const [nightMode, setNightMode] = useState<boolean>(false);
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const isNotMobile = useMediaQuery({ minWidth: 480 });

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
        <section className="bg-skin-bg h-screen overflow-auto">
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className={clsx(
                'sticky top-[0] flex items-center bg-skin-bg py-sm px-lg drop-shadow-md z-10',
                !isNotMobile && 'gap-md',
            )}
            >
                <a className="no-underline" href="/" aria-label="Logo link">
                    <Logo />
                </a>

                <Searchbar />

                <label className="cursor-pointer ml-auto" htmlFor="theme-toggler" title="Toggle theme" aria-label="Toggle theme">
                    <input className="hidden" type="checkbox" id="theme-toggler" onChange={toggleDarkMode} />

                    {
                        nightMode ? (
                            <MdModeNight className="text-skin-text-light text-lg" />
                        ) : (
                            <MdOutlineWbSunny className="text-skin-text-light text-lg" />
                        )
                    }
                </label>
            </header>

            <main className="flex items-start">
                {isNotMobile && <LeftSidebar />}

                <section className="flex-1 p-lg">
                    {children}
                </section>

                {isDesktop && <RightSidebar />}
            </main>

            {!isNotMobile && <BottomNav />}
        </section>
    );
}
