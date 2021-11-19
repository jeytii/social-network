import { HTMLAttributes, useState } from 'react';
import { MdPersonAddAlt, MdOutlinePersonRemove } from 'react-icons/md';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import axios from 'config/axios';
import type { User as UserType } from 'types/user';
import useDebounceClick from 'hooks/useDebounceClick';
import Cookies from 'js-cookie';

type Props = UserType & HTMLAttributes<HTMLDivElement>;

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
    const [debounce, mutatePreviousState] = useDebounceClick(
        followed as boolean,
        follow,
        unfollow,
    );

    async function follow() {
        try {
            await axios(Cookies.get('token')).post(`/api/users/${slug}/follow`);
            mutatePreviousState(true);
        } catch (e) {
            setFollowed(false);
        }
    }

    async function unfollow() {
        try {
            await axios(Cookies.get('token')).delete(
                `/api/users/${slug}/unfollow`,
            );
            mutatePreviousState(false);
        } catch (e) {
            setFollowed(true);
        }
    }

    function toggleFollow() {
        setFollowed(current => !current);
        debounce();
    }

    return (
        <div
            className={clsx('flex items-center rounded-md', className)}
            {...props}
        >
            <BasicInfo
                name={name}
                username={username}
                gender={gender}
                image_url={image_url}
            />

            {!is_self && (
                <button
                    className={clsx(
                        'rounded-full p-sm ml-auto',
                        followed
                            ? 'hover:bg-danger-lighter'
                            : 'hover:bg-primary-lighter',
                    )}
                    type='button'
                    onClick={toggleFollow}
                >
                    {followed ? (
                        <MdOutlinePersonRemove className='text-lg text-danger' />
                    ) : (
                        <MdPersonAddAlt className='text-lg text-primary' />
                    )}
                </button>
            )}
        </div>
    );
}
