import { useEffect, useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children }: { children: ReactNode }) {
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

    return mounted ? createPortal(children, ref.current as Element) : null;
}
