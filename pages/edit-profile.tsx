import Protected from 'components/Protected';
import ImageUploader from 'components/layouts/profile/ImageUploader';
import InputField from 'components/utilities/InputField';

export default function EditProfile() {
    return (
        <Protected title='Edit profile - Sosyal.me'>
            <section className='p-lg sm:px-md'>
                <form className='max-w-[480px] m-auto'>
                    <ImageUploader />

                    <InputField
                        containerClassName='mt-lg'
                        id='name'
                        label='Name'
                        aria-label='Name field'
                        error={null}
                        autoFocus
                    />

                    <label className='block mt-lg' htmlFor='birthdate'>
                        <span className='block text-skin-text text-md font-bold'>
                            Birthdate
                        </span>

                        <input
                            className='w-full bg-skin-bg-contrast text-skin-text text-md rounded-md p-sm border border-skin-bg-contrast cursor-pointer mt-xs appearance-none'
                            id='birthdate'
                            type='date'
                        />
                    </label>

                    <label className='block text-md mt-lg' htmlFor='bio'>
                        <span className='flex items-center'>
                            <span className='text-skin-text font-bold'>
                                Bio
                            </span>
                            <span className='text-primary text-md ml-auto'>
                                180
                            </span>
                        </span>

                        <textarea
                            className='textfield resize-none mt-xs'
                            id='bio'
                            rows={3}
                        />
                    </label>

                    <button
                        type='button'
                        className='btn-primary w-full text-md mt-lg'
                    >
                        Update profile
                    </button>
                </form>
            </section>
        </Protected>
    );
}
