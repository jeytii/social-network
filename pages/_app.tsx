import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css';

const client = new QueryClient();

function MyApp({ Component, pageProps }) {
    return (
        <QueryClientProvider client={client}>
            <Component {...pageProps} />
        </QueryClientProvider>
    );
}

export default MyApp;
