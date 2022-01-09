import { ReactNode } from 'react';
import { useQueryClient } from 'react-query';
import { Dialog } from '@headlessui/react';
import { User } from 'types/user';
import clsx from 'clsx';

interface Props {
    isOpen: boolean;
    closeEvent(): void;
    children: ReactNode;
}

type UserType = User & {
    dark_mode: boolean;
};

export default function Modal({ isOpen, closeEvent, children }: Props) {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<UserType>('user');

    return (
        <Dialog
            as='div'
            open={isOpen}
            className={clsx(
                'modal-wrapper overflow-y-auto',
                user?.dark_mode && 'dark',
            )}
            onClose={closeEvent}
        >
            <div className='w-[720px] px-4 text-center'>
                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                    className='inline-block h-screen align-middle'
                    aria-hidden='true'
                >
                    &#8203;
                </span>

                <div className='inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-skin shadow-xl rounded border border-skin-main'>
                    {children}
                </div>
            </div>
        </Dialog>
    );
}
