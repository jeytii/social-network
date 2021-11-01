import { ReactNode } from 'react';
import Head from 'next/head';
import Logo from 'components/Logo';

interface Props {
    title: string;
    children: ReactNode;
}

export default function Public({ title, children }: Props) {
    return (
        <section className='bg-skin-bg h-screen px-md'>
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

            <header className='flex items-center justify-center py-lg'>
                <Logo />
            </header>

            {children}
        </section>
    );
}
