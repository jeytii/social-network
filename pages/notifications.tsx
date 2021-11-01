import Link from 'next/link';
import { MdAccountCircle, MdOutlineChecklist } from 'react-icons/md';
import Protected from 'components/Protected';

export default function Notifications() {
    return (
        <Protected title='Notifications - Sosyal.me'>
            <section className='px-lg pt-sm pb-lg sm:px-md'>
                <div className='flex items-center'>
                    <h1 className='text-skin-text font-semibold'>
                        Notifications
                    </h1>

                    <button
                        className='p-sm rounded-full ml-auto hover:bg-primary-lighter'
                        type='button'
                        title='Mark all as read'
                    >
                        <MdOutlineChecklist className='text-primary text-xl' />
                    </button>
                </div>

                <div className='mt-sm'>
                    <div>
                        <Link href='/'>
                            <span className='flex items-center bg-skin-bg-contrast-light text-skin-text border border-skin-bg-contrast p-sm rounded-md cursor-pointer'>
                                <MdAccountCircle
                                    className='block text-skin-text-light'
                                    size={60}
                                />
                                <span className='text-md ml-sm sm:text-sm'>
                                    <b>John Doe</b> <span>followed you.</span>
                                </span>
                            </span>
                        </Link>
                    </div>

                    <div className='mt-lg'>
                        <Link href='/'>
                            <span className='flex items-center bg-primary-lighter text-skin-text border border-primary p-sm rounded-md cursor-pointer'>
                                <MdAccountCircle
                                    className='block text-skin-text-light'
                                    size={60}
                                />
                                <p className='text-md ml-sm sm:text-sm'>
                                    <b>John Doe</b> <span>followed you.</span>
                                </p>
                            </span>
                        </Link>
                    </div>

                    <div className='mt-lg'>
                        <Link href='/'>
                            <span className='flex items-center bg-skin-bg-contrast-light text-skin-text border border-skin-bg-contrast p-sm rounded-md cursor-pointer'>
                                <MdAccountCircle
                                    className='block text-skin-text-light'
                                    size={60}
                                />
                                <span className='text-md ml-sm sm:text-sm'>
                                    <b>John Doe</b> <span>followed you.</span>
                                </span>
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </Protected>
    );
}
