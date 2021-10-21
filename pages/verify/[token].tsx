import Public from 'components/Public';
import InputField from 'components/utilities/InputField';

export default function ForgotPassword() {
    return (
        <Public title="Verify account - Sosyal.me">
            <div className="py-md sm:px-md">
                <main className="max-w-screen-sm m-auto rounded-md bg-skin-bg-contrast p-lg">
                    <h1 className="text-lg font-bold text-skin-text-light text-center">Verify your account</h1>

                    <form className="mt-lg">
                        <InputField id="code" type="number" label="6-digit verification code" />
                        <button type="button" className="btn-primary mt-lg w-full" disabled>Verify my account</button>
                    </form>
                </main>
            </div>
        </Public>
    );
}
