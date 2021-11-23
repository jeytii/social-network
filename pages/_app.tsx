import { AppProps } from 'next/dist/shared/lib/router/router';
import {
    QueryClient,
    QueryClientProvider,
    QueryFunctionContext,
    QueryMeta,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Root from 'components/Root';
import { axiosClient } from 'config/axios';
import '../styles/globals.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            async queryFn({ pageParam = 0, meta }: QueryFunctionContext) {
                const { url, returnKey, ...params } = meta as QueryMeta;

                const { data } = await axiosClient().get(url as string, {
                    params: {
                        page: pageParam,
                        ...params,
                    },
                });

                return returnKey ? data[returnKey as string] : data;
            },
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: 1,
            retryDelay: 1000,
        },
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    const { title, isPrivate, ...props } = pageProps;

    queryClient.setMutationDefaults('create', {
        mutationFn: ({ url, data }) => axiosClient().post(url, data),
    });

    queryClient.setMutationDefaults('update', {
        mutationFn: ({ url, data }) => axiosClient().put(url, data),
    });

    queryClient.setMutationDefaults('delete', {
        mutationFn: ({ url }) => axiosClient().delete(url),
    });

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
