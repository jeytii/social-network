import { ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Public from './Public';
import Protected from './Protected';

interface Props {
    title: string;
    isPrivate: boolean;
    notificationsCount: number;
    children: ReactNode;
}

export default function Root({ isPrivate, children, ...props }: Props) {
    const bar = useRef<HTMLDivElement | null>(null);
    const { events } = useRouter();

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
        <>
            <div
                ref={bar}
                className='fixed top-[0px] left-[0px] w-[0px] h-[4px] bg-primary z-50'
            />

            {isPrivate ? (
                <Protected {...props}>{children}</Protected>
            ) : (
                <Public {...props}>{children}</Public>
            )}
        </>
    );
}
