import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Props {
    isOpen: boolean;
    closeEvent(): void;
    children: ReactNode;
}

export default function Modal({ isOpen, closeEvent, children }: Props) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as='div'
                className='modal-wrapper overflow-y-auto'
                onClose={closeEvent}
            >
                <div className='w-[720px] px-4 text-center'>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-200'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <Dialog.Overlay className='fixed inset-0' />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className='inline-block h-screen align-middle'
                        aria-hidden='true'
                    >
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-200'
                        enterFrom='opacity-0 scale-95'
                        enterTo='opacity-100 scale-100'
                        leave='ease-in duration-100'
                        leaveFrom='opacity-100 scale-100'
                        leaveTo='opacity-0 scale-95'
                    >
                        <div className='inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl bg-skin-bg'>
                            {children}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
