import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
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
                <MdAccountCircle
                    className='text-skin-text-light'
                    size={imageSize}
                    viewBox='2 2 20 20'
                />

                <figcaption className='flex-1 grid px-sm'>
                    <span className='block text-skin-text font-bold text-sm truncate xs:text-xs'>
                        {name}
                    </span>
                    <span className='block text-skin-text-light text-sm truncate xs:text-xs'>
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

export default BasicInfo;
