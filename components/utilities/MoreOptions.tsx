import { useEffect, MouseEvent } from 'react';

interface Props {
    editEvent(event: MouseEvent<HTMLButtonElement>): void;
    deleteEvent(event: MouseEvent<HTMLButtonElement>): void;
    close(): void;
}

export default function MoreOptions({ editEvent, deleteEvent, close }: Props) {
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
        <div className='absolute right-[0px] bg-skin-white rounded shadow-md'>
            <button
                className='block w-full text-sm text-skin-secondary rounded-t py-sm px-lg hover:text-skin-primary'
                type='button'
                onClick={editEvent}
            >
                Edit
            </button>

            <button
                className='block w-full text-sm text-skin-secondary rounded-b py-sm px-lg hover:text-skin-primary'
                type='button'
                onClick={deleteEvent}
            >
                Delete
            </button>
        </div>
    );
}
