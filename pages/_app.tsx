import { AppProps } from 'next/dist/shared/lib/router/router';
import Root from 'components/Root';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Root title={pageProps.title} isPrivate={pageProps.isPrivate}>
            <Component {...pageProps} />
        </Root>
    );
}

export default MyApp;
