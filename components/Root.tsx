import { ReactNode } from 'react';
import Public from './Public';
import Protected from './Protected';

interface Props {
    title: string;
    isPrivate: boolean;
    notificationsCount: number;
    children: ReactNode;
}

export default function Root({ isPrivate, children, ...props }: Props) {
    if (!isPrivate) {
        return <Public {...props}>{children}</Public>;
    }

    return <Protected {...props}>{children}</Protected>;
}
