import { useEffect } from 'react';

interface Props {
    editEvent(): void;
    close(): void;
}

export default function PostOptions({ editEvent, close }: Props) {
    function closeOnEscape(event: KeyboardEvent) {
        if (event.key !== 'Escape') {
            return;
        }

        close();
    }

    useEffect(() => {
        window.addEventListener('keydown', closeOnEscape);
        window.addEventListener('click', close);

        return () => {
            window.removeEventListener('keydown', closeOnEscape);
            window.removeEventListener('click', close);
        };
    }, []);
    return (
        <div className='absolute right-[0px] bg-skin-bg rounded-md shadow-md'>
            <button
                className='block w-full text-sm text-skin-text rounded-t-md py-sm px-lg hover:bg-skin-bg-contrast-light hover:text-skin-text-dark'
                type='button'
                onClick={editEvent}
            >
                Edit
            </button>

            <button
                className='block w-full text-sm text-skin-text rounded-b-md py-sm px-lg hover:bg-skin-bg-contrast-light hover:text-skin-text-dark'
                type='button'
            >
                Delete
            </button>
        </div>
    );
}
