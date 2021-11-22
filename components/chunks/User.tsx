import Link from 'next/link';
import { HTMLAttributes, useState } from 'react';
import { MdPersonAddAlt, MdOutlinePersonRemove } from 'react-icons/md';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'config/axios';
import type { User as UserType } from 'types/user';

interface Props extends UserType, HTMLAttributes<HTMLDivElement> {
    imageSize?: number;
}

const authToken = Cookies.get('token');

function User({
    className,
    slug,
    name,
    username,
    gender,
    image_url,
    imageSize,
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
            await axios(authToken).post(`/api/users/${slug}/follow`);
            mutatePreviousState(true);
        } catch (e) {
            setFollowed(false);
        }
    }

    async function unfollow() {
        try {
            await axios(authToken).delete(`/api/users/${slug}/unfollow`);
            mutatePreviousState(false);
        } catch (e) {
            setFollowed(true);
        }
    }

    function toggleFollow(event: MouseEvent) {
        event.preventDefault();

        setFollowed(current => !current);
        debounce();
    }

    return (
        <Link href={`/${username}`}>
            <div
                className={clsx(
                    'flex items-center rounded-md cursor-pointer',
                    className,
                )}
                {...props}
            >
                <BasicInfo
                    name={name}
                    username={username}
                    gender={gender}
                    image_url={image_url}
                    imageSize={imageSize}
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
        </Link>
    );
}

User.defaultProps = {
    imageSize: 40,
};

export default User;
