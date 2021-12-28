import Link from 'next/link';
import Image from 'next/image';
import { forwardRef, Ref } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import clsx from 'clsx';
import type { Notification as NotificationType } from 'types/notification';

interface Props extends NotificationType {
    className: string;
}

const Notification = forwardRef(
    ({ className, ...props }: Props, ref: Ref<HTMLElement>) => {
        const { name, image_url } = props.user;

        return (
            <Link href={props.url}>
                <figure
                    ref={ref}
                    className={clsx(
                        'flex items-center p-md rounded cursor-pointer',
                        {
                            'bg-primary-transparent': props.is_read,
                            'text-skin-secondary': props.is_read,
                            'bg-skin-main': !props.is_read,
                            'text-skin-primary': !props.is_read,
                        },
                        className,
                    )}
                >
                    {image_url ? (
                        <Image
                            className='block'
                            src={image_url}
                            width={50}
                            height={50}
                        />
                    ) : (
                        <MdAccountCircle
                            className='block text-skin-secondary'
                            size={50}
                            viewBox='2 2 20 20'
                        />
                    )}

                    <figcaption className='ml-sm'>
                        <p className='text-md sm:text-sm'>
                            <b>{name}</b> <span>{props.message}</span>
                        </p>
                    </figcaption>
                </figure>
            </Link>
        );
    },
);

export default Notification;
