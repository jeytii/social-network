import Protected from 'components/Protected';
import InputField from 'components/utilities/InputField';

export default function ChangePassword() {
    return (
        <Protected title='Change password'>
            <section className='p-lg'>
                <div className='flex items-center bg-primary-lighter text-md text-primary p-md border-primary rounded-md'>
                    You can only change your password 3 times within 30 days.
                </div>

                <form className='mt-sm'>
                    <InputField
                        className='text-md'
                        id='old-password'
                        type='password'
                        label='Old password'
                    />

                    <InputField
                        containerClassName='mt-lg'
                        className='text-md'
                        id='new-password'
                        type='password'
                        label='New password'
                    />

                    <InputField
                        containerClassName='mt-lg'
                        className='text-md'
                        id='new-password-confirmation'
                        type='password'
                        label='Confirm new password'
                    />

                    <button
                        className='button button-primary w-full mt-lg'
                        type='button'
                    >
                        Update my password
                    </button>
                </form>
            </section>
        </Protected>
    );
}
