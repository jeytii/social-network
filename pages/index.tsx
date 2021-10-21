import Head from 'next/head';
import Logo from 'components/Logo';
import InputField from 'components/utilities/InputField';
import { BiErrorCircle } from 'react-icons/bi';

export default function Home() {
    return (
        <section className="bg-skin-bg h-screen">
            <Head>
                <title>Welcome to sosyal.me</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="flex items-center justify-center py-lg">
                <Logo />
            </header>

            <div className="py-md sm:px-md">
                <main className="max-w-screen-sm m-auto rounded-md bg-skin-bg-contrast p-lg">
                    <h1 className="text-lg font-bold text-skin-text-light text-center">Sign in to your account</h1>

                    <div className="flex items-center bg-danger-lighter text-danger p-md border-danger rounded-md mt-lg">
                        <BiErrorCircle className="text-lg" />
                        <span className="ml-sm">Incorrect combination</span>
                    </div>

                    <form className="py-lg">
                        <InputField id="username" type="text" label="Username or email address" autoFocus />

                        <InputField containerClassName="mt-md" id="password" type="password" label="Password" />

                        <button type="button" className="btn-primary mt-lg w-full" disabled>Sign in</button>
                    </form>

                    <a href="/" className="text-primary no-underline text-center block">Create an account</a>

                    <a href="/" className="text-skin-text-light no-underline text-center block mt-sm">Forgot password</a>
                </main>
            </div>
        </section>
    );
}
