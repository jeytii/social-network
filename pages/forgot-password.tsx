import Public from 'components/Public';
import InputField from 'components/utilities/InputField';

export default function ForgotPassword() {
    return (
        <Public title='Forgot password - Sosyal.me'>
            <div className='py-md'>
                <main className='max-w-[480px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                    <div className='bg-primary-lighter rounded-md p-sm'>
                        <p className='text-primary text-md m-0'>
                            After successfully making a request, you should
                            reset your password within <b>30 minutes</b>.
                            Otherwise, send another request.
                        </p>
                    </div>

                    <form className='mt-lg'>
                        <InputField
                            id='email'
                            type='email'
                            label='Email address'
                        />
                        <button
                            type='button'
                            className='btn-primary w-full text-md mt-lg'
                            disabled
                        >
                            Send request
                        </button>
                    </form>
                </main>
            </div>
        </Public>
    );
}
