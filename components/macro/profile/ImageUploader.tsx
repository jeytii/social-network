import Image from 'next/image';
import { ChangeEvent } from 'react';
import { MdAccountCircle, MdUpload, MdOutlineRefresh } from 'react-icons/md';
import clsx from 'clsx';
import Spinner from 'components/vectors/Spinner';

interface Props {
    src: string | null;
    initialSrc: string | null;
    loading: boolean;
    hasError: boolean;
    onChange(event: ChangeEvent<HTMLInputElement>): void;
    onReset(): void;
}

export default function ImageUploader({
    src,
    initialSrc,
    loading,
    hasError,
    onChange,
    onReset,
}: Props) {
    return (
        <section>
            {loading ? (
                <Spinner className='flex items-center justify-center w-[100px] h-[100px] rounded-full m-auto' />
            ) : (
                <div className='block w-[100px] rounded-full m-auto'>
                    {src ? (
                        <Image
                            className='block w-full h-full'
                            src={src}
                            width='100%'
                            height='100%'
                            layout='responsive'
                        />
                    ) : (
                        <MdAccountCircle
                            className='text-skin-secondary block w-full h-full'
                            viewBox='2 2 20 20'
                        />
                    )}
                </div>
            )}

            <div className='text-center mt-sm'>
                <label
                    htmlFor='upload'
                    className='button button-primary inline-flex items-center font-normal text-sm'
                >
                    <MdUpload />
                    <span className='ml-xs'>Upload</span>
                    <input
                        className='hidden'
                        type='file'
                        id='upload'
                        onChange={onChange}
                    />
                </label>

                <button
                    className='button button-default inline-flex items-center font-normal text-sm ml-sm'
                    type='button'
                    disabled={src === initialSrc}
                    onClick={onReset}
                >
                    <MdOutlineRefresh />
                    <span className='ml-xs'>Reset</span>
                </button>
            </div>

            <p
                className={clsx(
                    'text-sm text-center mt-sm',
                    hasError ? 'text-danger' : 'text-skin-secondary',
                )}
            >
                Must be between <b>200x200</b> and <b>800x800</b>.
            </p>
        </section>
    );
}
