import Link from 'next/link';
import Protected from 'components/Protected';

export default function Settings() {
    return (
        <Protected title='Settings - Sosyal.me'>
            <section className='p-lg'>
                <h1 className='text-md text-skin-text font-bold'>Settings</h1>

                <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-sm'>
                    <div>
                        <span className='block text-md text-primary font-bold'>
                            Username
                        </span>
                        <span className='block text-md text-skin-text-light'>
                            john.doe
                        </span>
                    </div>

                    <Link href='/settings/username'>
                        <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                            Change
                        </span>
                    </Link>
                </section>

                <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-lg'>
                    <div>
                        <span className='block text-md text-primary font-bold'>
                            Email address
                        </span>
                        <span className='block text-md text-skin-text-light'>
                            john.doe@email.com
                        </span>
                    </div>

                    <Link href='/settings/email-address'>
                        <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                            Change
                        </span>
                    </Link>
                </section>

                <section className='flex items-center bg-skin-bg-contrast rounded-md p-md mt-lg'>
                    <div>
                        <span className='block text-md text-primary font-bold'>
                            Phone number
                        </span>
                        <span className='block text-md text-skin-text-light'>
                            09123456789
                        </span>
                    </div>

                    <Link href='/settings/phone-number'>
                        <span className='text-sm text-primary cursor-pointer ml-auto hover:text-primary-dark'>
                            Change
                        </span>
                    </Link>
                </section>

                <Link href='/settings/password'>
                    <span className='inline-block text-sm text-primary cursor-pointer mt-lg hover:text-primary-dark'>
                        Change password
                    </span>
                </Link>
            </section>
        </Protected>
    );
}
