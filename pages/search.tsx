import { MdPersonAddAlt } from 'react-icons/md';
import Protected from 'components/Protected';
import BasicInfo from 'components/utilities/BasicInfo';

export default function Search() {
    return (
        <Protected title='Search people - Sosyal.me'>
            <section className='p-lg'>
                <h1 className='text-md text-skin-text font-bold'>
                    Search people
                </h1>

                <div className='mt-sm'>
                    <div className='flex items-center bg-skin-bg-contrast rounded-md p-sm'>
                        <BasicInfo
                            name='John Doe'
                            username='@john.doe'
                            gender='Male'
                            image_url='/'
                            imageSize={50}
                        />

                        <button
                            type='button'
                            className='rounded-full p-sm ml-auto hover:bg-primary-lighter'
                        >
                            <MdPersonAddAlt className='text-lg text-primary' />
                        </button>
                    </div>
                    <div className='flex items-center bg-skin-bg-contrast rounded-md p-sm mt-lg'>
                        <BasicInfo
                            name='John Doe'
                            username='@john.doe'
                            gender='Male'
                            image_url='/'
                            imageSize={50}
                        />

                        <button
                            type='button'
                            className='rounded-full p-sm ml-auto hover:bg-primary-lighter'
                        >
                            <MdPersonAddAlt className='text-lg text-primary' />
                        </button>
                    </div>
                    <div className='flex items-center bg-skin-bg-contrast rounded-md p-sm mt-lg'>
                        <BasicInfo
                            name='John Doe'
                            username='@john.doe'
                            gender='Male'
                            image_url='/'
                            imageSize={50}
                        />

                        <button
                            type='button'
                            className='rounded-full p-sm ml-auto hover:bg-primary-lighter'
                        >
                            <MdPersonAddAlt className='text-lg text-primary' />
                        </button>
                    </div>
                </div>
            </section>
        </Protected>
    );
}
