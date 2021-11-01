import Image from 'next/image';
import { useState } from 'react';
import { MdAccountCircle, MdCameraAlt } from 'react-icons/md';
import Spinner from 'components/vectors/Spinner';

export default function ImageUploader() {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <section>
            {loading ? (
                <Spinner className='w-[100px] h-[100px] rounded-full bg-skin-bg-contrast m-auto' />
            ) : (
                <div className='relative block w-[100px] rounded-full overflow-hidden m-auto'>
                    <MdAccountCircle
                        className='text-skin-text-light block w-full h-full'
                        viewBox='2 2 20 20'
                    />

                    {/* <Image
                        className="block w-full h-full"
                        src="https://avatarfiles.alphacoders.com/867/thumb-1920-86706.jpg"
                        width="100%"
                        height="100%"
                        layout="responsive"
                    /> */}

                    <label
                        className='absolute w-full bottom-[0px] py-sm cursor-pointer'
                        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                        htmlFor='upload'
                    >
                        <input className='hidden' type='file' id='upload' />
                        <MdCameraAlt
                            className='block m-auto'
                            size={20}
                            fill='#fff'
                        />
                    </label>
                </div>
            )}

            <p className='text-skin-text-light text-sm text-center mt-xs'>
                Must be between <b>200x200</b> and <b>800x800</b>.
            </p>
        </section>
    );
}
