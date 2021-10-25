import { MdSearch } from 'react-icons/md';
import clsx from 'clsx';

export default function Searchbar({ isMobile }: { isMobile: boolean }) {
    return (
        <form className={clsx(
            'flex rounded-full',
            isMobile ? 'w-full' : 'max-w-xs ml-lg',
        )}
        >
            <input
                className="flex-1 w-full bg-skin-bg-contrast text-skin-text text-sm border-none rounded-l-full p-sm"
                type="text"
                placeholder="Search people"
            />

            <button
                className="bg-skin-bg-contrast border-none px-sm rounded-r-full"
                type="button"
                aria-label="Search button"
            >
                <MdSearch className="text-lg text-skin-text-light" />
            </button>
        </form>
    );
}
