import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
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

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <Protected title={title}>{children}</Protected>
        </QueryClientProvider>
    );
}
