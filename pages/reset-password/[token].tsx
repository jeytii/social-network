import Public from 'components/Public';
import InputField from 'components/utilities/InputField';

export default function ForgotPassword() {
    return (
        <Public title="Reset password - Sosyal.me">
            <div className="py-md sm:px-md">
                <main className="max-w-screen-sm m-auto rounded-md bg-skin-bg-contrast p-lg">
                    <h1 className="text-lg font-bold text-skin-text-light text-center">Reset your password</h1>

                    <form className="mt-lg">
                        <InputField id="email" type="email" label="Email address" />
                        <InputField containerClassName="mt-lg" id="password" type="password" label="New password" />
                        <InputField containerClassName="mt-lg" id="password_confirmation" type="password" label="Confirm new password" />

                        <button type="button" className="btn-primary mt-lg w-full" disabled>Reset my password</button>
                    </form>
                </main>
            </div>
        </Public>
    );
}
