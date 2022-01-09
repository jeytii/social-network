import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { InfiniteData, useMutation, useQueryClient } from 'react-query';
import { MdOutlineChecklist } from 'react-icons/md';
import clsx from 'clsx';
import Notification from 'components/chunks/Notification';
import Spinner from 'components/vectors/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { axiosServer } from 'config/axios';
import type { NotificationPage } from 'types/page';
import type { Notification as NotificationType } from 'types/notification';

export default function Notifications() {
    const queryClient = useQueryClient();
    const notificationsCount = queryClient.getQueryData('notificationsCount');
    const { data, ref, isLoading, isFetchingNextPage, isSuccess } =
        useInfiniteScroll<NotificationPage, NotificationType>({
            queryKey: 'notifications',
            meta: {
                url: '/api/notifications',
            },
            cacheTime: Infinity,
            select: ({ pageParams, pages }) => ({
                pageParams,
                pages: pages.flatMap(page => [...page.items]),
            }),
        });

    const { mutate: read } = useMutation<unknown, unknown, { url: string }>(
        'update',
        {
            onSuccess() {
                const notifs =
                    queryClient.getQueryData<InfiniteData<NotificationPage>>(
                        'notifications',
                    );

                notifs?.pages.forEach(page => {
                    page.items.forEach(item => {
                        const clone = item;

                        clone.is_read = true;
                    });
                });
            },
        },
    );

    const { mutate: peekAll } = useMutation<unknown, unknown, { url: string }>(
        'update',
        {
            onSuccess() {
                queryClient.setQueryData('notificationsCount', 0);
            },
        },
    );

    function readAll() {
        read({
            url: '/api/notifications/read/all',
        });
    }

    useEffect(() => {
        if (notificationsCount) {
            peekAll({ url: '/api/notifications/peek' });
        }
    }, []);

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md font-bold text-skin-secondary opacity-50 text-center'>
                    No notification to show.
                </h1>
            </section>
        );
    }

    return (
        <section className='px-lg pt-sm pb-lg sm:px-md'>
            <div className='flex items-center'>
                <h1 className='text-skin-primary font-bold'>Notifications</h1>

                <button
                    className='p-sm rounded-full ml-auto hover:bg-skin-main'
                    type='button'
                    title='Mark all as read'
                    onClick={readAll}
                >
                    <MdOutlineChecklist className='text-primary text-xl' />
                </button>
            </div>

            <div className='mt-sm'>
                {data?.pages.map((notification, index) => (
                    <Notification
                        key={notification.slug}
                        ref={index === data.pages.length - 1 ? ref : null}
                        className={clsx(!!index && 'mt-lg')}
                        {...notification}
                    />
                ))}
            </div>

            {isFetchingNextPage && <Spinner className='mt-lg' />}
        </section>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const defaultReturn = {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };

    if (!req.cookies || !req.cookies.token) {
        return defaultReturn;
    }

    try {
        const responses = await Promise.all([
            axiosServer(req.cookies.token).get('/private'),
            axiosServer(req.cookies.token).get('/api/notifications/count'),
        ]);

        return {
            props: {
                title: 'Notifications',
                isPrivate: true,
                user: responses[0].data.data,
                notificationsCount: responses[1].data.data,
            },
        };
    } catch (e) {
        return defaultReturn;
    }
};
