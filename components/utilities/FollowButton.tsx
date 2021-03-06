import { useState, MouseEvent, useEffect, memo } from 'react';
import clsx from 'clsx';
import useDebounceClick from 'hooks/useDebounceClick';
import axios from 'lib/axios';

interface Props {
    userSlug: string;
    condition: boolean;
}

function FollowButton({ userSlug, condition }: Props) {
    const [followed, setFollowed] = useState<boolean>(condition);
    const [debounce, mutatePrevious] = useDebounceClick(
        followed,
        follow,
        unfollow,
    );

    useEffect(() => {
        setFollowed(condition);
    }, [userSlug]);

    async function follow() {
        try {
            await axios().post(`/api/users/${userSlug}/follow`);

            mutatePrevious(true);
        } catch (e) {
            setFollowed(false);
        }
    }

    async function unfollow() {
        try {
            await axios().delete(`/api/users/${userSlug}/unfollow`);

            mutatePrevious(false);
        } catch (e) {
            setFollowed(true);
        }
    }

    function toggleFollow(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        setFollowed(current => !current);

        debounce();
    }

    return (
        <button
            className={clsx(
                'button button-primary-outlined text-sm rounded-full ml-auto sm:mt-sm',
                followed ? 'button-danger-outlined' : 'button-primary-outlined',
            )}
            type='button'
            onClick={toggleFollow}
        >
            {followed ? 'Unfollow' : 'Follow'}
        </button>
    );
}

export default memo(
    FollowButton,
    (prev, current) => prev.condition === current.condition,
);
