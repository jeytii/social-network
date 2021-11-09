import { HTMLAttributes } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import clsx from 'clsx';
import type { User } from 'types/user';

interface Props extends User, HTMLAttributes<HTMLDivElement> {
    imageSize?: number;
}

function BasicInfo({
    className,
    image_url,
    imageSize,
    is_self,
    is_followed,
    ...props
}: Props) {
    return (
        <figure className={clsx('flex items-center', className)} {...props}>
            <MdAccountCircle
                className='text-skin-text-light'
                size={imageSize}
                viewBox='2 2 20 20'
            />

            <figcaption className='flex-1 grid px-sm'>
                <span className='block text-skin-text font-bold text-sm truncate'>
                    {props.name}
                </span>
                <span className='block text-skin-text-light text-sm truncate'>
                    {props.username}
                </span>
            </figcaption>
        </figure>
    );
}

BasicInfo.defaultProps = {
    imageSize: 40,
};

export default BasicInfo;
