import Link from 'next/link';
import {
    useState,
    forwardRef,
    memo,
    HTMLAttributes,
    MouseEventHandler,
    Ref,
} from 'react';
import { MdPersonAddAlt, MdOutlinePersonRemove } from 'react-icons/md';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'lib/axios';
import type { User as UserType } from 'types/user';

interface Props extends UserType, HTMLAttributes<HTMLDivElement> {
    imageSize?: number;
}

const User = forwardRef(
    (
        {
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
        }: Props,
        ref: Ref<HTMLDivElement>,
    ) => {
        const [followed, setFollowed] = useState<boolean | null>(is_followed);
        const [debounce, mutatePreviousState] = useDebounceClick(
            followed as boolean,
            follow,
            unfollow,
        );

        async function follow() {
            try {
                await axios().post(`/api/users/${slug}/follow`);
                mutatePreviousState(true);
            } catch (e) {
                setFollowed(false);
            }
        }

        async function unfollow() {
            try {
                await axios().delete(`/api/users/${slug}/unfollow`);
                mutatePreviousState(false);
            } catch (e) {
                setFollowed(true);
            }
        }

        const toggleFollow: MouseEventHandler<HTMLButtonElement> = event => {
            event.preventDefault();

            setFollowed(current => !current);
            debounce();
        };

        return (
            <Link href={`/${username}`}>
                <div
                    ref={ref}
                    className={clsx(
                        'flex items-center rounded cursor-pointer',
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
                                    ? 'hover:bg-danger-transparent'
                                    : 'hover:bg-primary-transparent',
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
    },
);

User.defaultProps = {
    imageSize: 40,
};

export default memo(
    User,
    (prev, current) => prev.is_followed === current.is_followed,
);
