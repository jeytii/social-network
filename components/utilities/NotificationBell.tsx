import Link from 'next/link';
import { useEffect } from 'react';
import { InfiniteData, useQueryClient } from 'react-query';
import { MdOutlineNotifications } from 'react-icons/md';
import Echo from 'laravel-echo';
import type { NotificationPage } from 'types/page';
import type { User } from 'types/user';
import type { Notification } from 'types/notification';
import 'pusher-js';

interface NotificationData {
    count: number;
    data: Notification;
}

const authorizer = channel => ({
    async authorize(socketId, callback) {
        try {
            const { data } = await axiosClient().post(
                '/api/broadcasting/auth',
                {
                    socket_id: socketId,
                    channel_name: channel.name,
                },
            );

            callback(false, data);
        } catch (error) {
            callback(true, error);
        }
    },
});

export default function NotificationBell() {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>('user');
    const count = queryClient.getQueryData<number>('notificationsCount');

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
            wsHost: '127.0.0.1',
            wsPort: 6001,
            forceTLS: false,
            disableStats: true,
            authorizer,
        });

        if (user?.slug) {
            echo.private(`notify.user.${user.slug}`).notification(
                (data: NotificationData) => {
                    queryClient.setQueryData('notificationsCount', data.count);

                    if (!queryClient.getQueryData('notifications')) {
                        queryClient.setQueryData<
                            InfiniteData<NotificationPage> | undefined
                        >('notifications', current => {
                            current?.pages[0].items.unshift(data.data);

                            return current;
                        });
                    }
                },
            );
        }
    }, [user?.slug]);

    return (
        <Link href='/notifications'>
            <div className='relative cursor-pointer ml-auto'>
                {!!count && (
                    <span className='absolute top-[-11px] right-[-9px] w-[20px] h-[20px] flex items-center justify-center bg-primary-dark text-xs text-skin-white rounded-full p-xs'>
                        {count >= 10 ? '9+' : count}
                    </span>
                )}

                <MdOutlineNotifications
                    className='text-skin-secondary text-lg'
                    viewBox='2 2 20 20'
                />
            </div>
        </Link>
    );
}
