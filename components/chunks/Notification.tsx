import Link from 'next/link';
import Image from 'next/image';
import { forwardRef, Ref } from 'react';
import { InfiniteData, useQueryClient } from 'react-query';
import { MdAccountCircle } from 'react-icons/md';
import clsx from 'clsx';
import { axiosClient } from 'config/axios';
import type { NotificationPage } from 'types/page';
import type { Notification as NotificationType } from 'types/notification';

interface Props extends NotificationType {
    className: string;
}

function Notification(
    { className, slug, message, is_read, url, user }: Props,
    ref: Ref<HTMLElement>,
) {
    const queryClient = useQueryClient();

    async function markAsRead() {
        if (is_read) {
            return;
        }

        await axiosClient().put(`/api/notifications/${slug}/read`);

        queryClient.setQueryData<InfiniteData<NotificationPage> | undefined>(
            'notifications',
            current => {
                const notifications = current?.pages.flatMap(page => [
                    ...page.items,
                ]);

                notifications?.forEach(n => {
                    const notification = n;

                    notification.is_read = true;
                });

                return current;
            },
        );
    }

    return (
        <Link href={url}>
            <figure
                ref={ref}
                className={clsx(
                    'flex items-center text-skin-primary p-md border rounded cursor-pointer',
                    is_read
                        ? 'border-skin-main'
                        : ['border-primary', 'bg-skin-main'],
                    className,
                )}
                onClick={markAsRead}
                aria-hidden
            >
                {user.image_url ? (
                    <Image
                        className='block'
                        src={user.image_url}
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
                        <b>{user.name}</b> <span>{message}</span>
                    </p>
                </figcaption>
            </figure>
        </Link>
    );
}

export default forwardRef(Notification);
