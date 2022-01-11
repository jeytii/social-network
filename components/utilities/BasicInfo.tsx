import Image from 'next/image';
import { memo, forwardRef, ForwardedRef, HTMLAttributes } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import clsx from 'clsx';

interface Props extends HTMLAttributes<HTMLElement> {
    name: string;
    username: string;
    gender: 'Male' | 'Female';
    image_url: string | null;
    imageSize?: number;
}

const BasicInfo = forwardRef(
    (
        {
            className,
            name,
            username,
            gender,
            image_url,
            imageSize,
            ...props
        }: Props,
        ref: ForwardedRef<HTMLElement>,
    ) => {
        return (
            <figure
                ref={ref}
                className={clsx('flex items-center', className)}
                {...props}
            >
                {image_url ? (
                    <Image
                        src={image_url}
                        width={imageSize}
                        height={imageSize}
                    />
                ) : (
                    <MdAccountCircle
                        className='text-skin-secondary'
                        size={imageSize}
                        viewBox='2 2 20 20'
                    />
                )}

                <figcaption className='flex-1 grid px-sm'>
                    <span className='block text-skin-primary font-bold text-sm truncate xs:text-sm'>
                        {name}
                    </span>
                    <span className='block text-skin-secondary text-sm truncate xs:text-xs'>
                        @{username}
                    </span>
                </figcaption>
            </figure>
        );
    },
);

BasicInfo.defaultProps = {
    imageSize: 40,
};

export default memo(BasicInfo);
