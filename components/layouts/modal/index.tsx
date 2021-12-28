import { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';

interface Props {
    isOpen: boolean;
    closeEvent(): void;
    children: ReactNode;
}

export default function Modal({ isOpen, closeEvent, children }: Props) {
    return (
        <Dialog
            as='div'
            open={isOpen}
            className='modal-wrapper overflow-y-auto'
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

                <div className='inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-skin-white shadow-xl rounded border border-primary-transparent'>
                    {children}
                </div>
            </div>
        </Dialog>
    );
}
