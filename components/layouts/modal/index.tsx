import { useEffect, useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Dialog } from '@headlessui/react';

interface Props {
    closeEvent(): void;
    children: ReactNode;
}

export default function Modal({ closeEvent, children }: Props) {
    const [mounted, setMounted] = useState<boolean>(false);
    const ref = useRef<Element | null>(null);

    useEffect(() => {
        ref.current = document.querySelector('#edit-post');
        setMounted(true);

        return () => {
            ref.current = null;
            setMounted(false);
        };
    }, []);

    if (!mounted) {
        return null;
    }

    return createPortal(
        <Dialog
            as='div'
            className='modal-wrapper overflow-y-auto'
            open
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

                <div className='inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl bg-skin-bg'>
                    {children}
                </div>
            </div>
        </Dialog>,
        ref.current as Element,
    );
}
