import { HTMLAttributes, useState } from 'react';
import { MdPersonAddAlt, MdOutlinePersonRemove } from 'react-icons/md';
import clsx from 'clsx';
import type { User as UserType } from 'types/user';
import BasicInfo from './BasicInfo';

interface Props extends UserType, HTMLAttributes<HTMLDivElement> { }

export default function User({
    className,
    slug,
    name,
    username,
    gender,
    image_url,
    is_self,
    is_followed,
    ...props
}: Props) {
    const [followed, setFollowed] = useState<boolean | null>(is_followed);

    function toggleFollowed() {
        setFollowed(current => !current);
    }

    return (
        <div
            className={clsx('flex items-center rounded-md', className)}
            {...props}
        >
            <BasicInfo
                name={name}
                username={`@${username}`}
                gender={gender}
                image_url={image_url}
                {...props}
            />

            <button
                className={clsx(
                    'rounded-full p-sm ml-auto',
                    followed
                        ? 'hover:bg-danger-lighter'
                        : 'hover:bg-primary-lighter',
                )}
                type='button'
                onClick={toggleFollowed}
            >
                {followed ? (
                    <MdOutlinePersonRemove className='text-lg text-danger' />
                ) : (
                    <MdPersonAddAlt className='text-lg text-primary' />
                )}
            </button>
        </div>
    );
}
