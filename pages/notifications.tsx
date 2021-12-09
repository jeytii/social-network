import { GetServerSideProps } from 'next';
import { MdOutlineChecklist } from 'react-icons/md';
import Notification from 'components/chunks/Notification';
import Spinner from 'components/vectors/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { axiosServer } from 'config/axios';
import { NotificationPage } from 'types/page';
import { Notification as NotificationType } from 'types/notification';
import clsx from 'clsx';

export default function Notifications() {
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

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !data?.pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md font-bold text-skin-text-light opacity-50 text-center'>
                    No notification to show.
                </h1>
            </section>
        );
    }

    return (
        <section className='px-lg pt-sm pb-lg sm:px-md'>
            <div className='flex items-center'>
                <h1 className='text-skin-text font-semibold'>Notifications</h1>

                <button
                    className='p-sm rounded-full ml-auto hover:bg-primary-lighter'
                    type='button'
                    title='Mark all as read'
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
    if (!req.cookies || !req.cookies.token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        await axiosServer(req.cookies.token).get('/private');

        return {
            props: {
                title: 'Notifications',
                isPrivate: true,
            },
        };
    } catch (e) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};
