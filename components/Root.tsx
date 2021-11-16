import { ReactNode } from 'react';
import Public from './Public';
import Protected from './Protected';

interface Props {
    title: string;
    isPrivate: boolean;
    children: ReactNode;
}

export default function Root({ title, isPrivate, children }: Props) {
    if (!isPrivate) {
        return <Public title={title}>{children}</Public>;
    }

    return <Protected title={title}>{children}</Protected>;
}
