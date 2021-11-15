import Protected from 'components/Protected';
import InputField from 'components/utilities/InputField';

export default function ChangePhoneNumber() {
    return (
        <Protected title='Change phone number'>
            <section className='p-lg'>
                <div className='flex items-center bg-primary-lighter text-md text-primary p-md border-primary rounded-md'>
                    You can only change your phone number 3 times within 30
                    days.
                </div>

                <form className='mt-sm'>
                    <InputField
                        className='text-md'
                        id='phone-number'
                        type='text'
                        label='Phone number'
                    />

                    <InputField
                        containerClassName='mt-lg'
                        className='text-md'
                        id='password'
                        type='password'
                        label='Password'
                    />

                    <button
                        className='button button-primary w-full mt-lg'
                        type='button'
                    >
                        Update my phone number
                    </button>
                </form>
            </section>
        </Protected>
    );
}
