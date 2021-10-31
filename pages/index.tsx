import Public from 'components/Public';
import InputField from 'components/utilities/InputField';
import { BiErrorCircle } from 'react-icons/bi';

export default function Home() {
    return (
        <Public title="Welcome to Sosyal.me">
            <div className="py-md sm:px-md">
                <main className="max-w-screen-sm m-auto rounded-md bg-skin-bg-contrast p-lg">
                    <h1 className="text-lg font-bold text-skin-text-light text-center">Sign in to your account</h1>

                    <div className="flex items-center bg-danger-lighter text-danger p-md border-danger rounded-md mt-lg">
                        <BiErrorCircle className="text-xl" />
                        <span className="text-sm ml-sm">Incorrect combination</span>
                    </div>

                    <form className="py-lg">
                        <InputField id="username" type="text" label="Username or email address" />

                        <InputField containerClassName="mt-md" id="password" type="password" label="Password" />

                        <button type="button" className="btn-primary mt-lg w-full" disabled>Sign in</button>
                    </form>

                    <a href="/" className="text-primary text-sm no-underline text-center block">Create an account</a>

                    <a href="/" className="text-skin-text-light text-sm no-underline text-center block mt-sm">Forgot password</a>
                </main>
            </div>
        </Public>
    );
}
