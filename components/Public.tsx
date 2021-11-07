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
                <title>{title}</title>
            </Head>

            <header className='flex items-center justify-center py-lg'>
                <Logo />
            </header>

            {children}
        </section>
    );
}
