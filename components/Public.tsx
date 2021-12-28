import { ReactNode } from 'react';
import Head from 'next/head';

interface Props {
    title: string;
    children: ReactNode;
}

export default function Public({ title, children }: Props) {
    return (
        <section className='px-md'>
            <Head>
                <title>{title}</title>
            </Head>

            {children}
        </section>
    );
}
