import { AppProps } from 'next/dist/shared/lib/router/router';
import {
    QueryClient,
    QueryClientProvider,
    QueryFunctionContext,
    QueryMeta,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Public from 'components/Public';
import Protected from 'components/Protected';
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
            retry: 0,
        },
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    const { isPrivate, ...props } = pageProps;

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
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}

            {isPrivate ? (
                <Protected {...props}>
                    <Component {...props} />
                </Protected>
            ) : (
                <Public {...props}>
                    <Component {...props} />
                </Public>
            )}
        </QueryClientProvider>
    );
}

export default MyApp;
