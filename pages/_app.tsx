import { AppProps } from 'next/dist/shared/lib/router/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Root from 'components/Root';
import '../styles/globals.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    const { title, isPrivate, ...props } = pageProps;

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <Root title={title} isPrivate={isPrivate}>
                <Component {...props} />
            </Root>
        </QueryClientProvider>
    );
}

export default MyApp;
