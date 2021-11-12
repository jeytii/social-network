import { AppProps } from 'next/dist/shared/lib/router/router';
import Root from 'components/Root';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const { title, isPrivate, ...props } = pageProps;

    return (
        <Root title={title} isPrivate={isPrivate}>
            <Component {...props} />
        </Root>
    );
}

export default MyApp;
