import { MdSearch } from 'react-icons/md';

export default function Searchbar() {
    return (
        <form className='bg-skin-bg-contrast flex rounded-full max-w-xs ml-lg sm:max-w-none sm:w-full sm:ml-auto'>
            <input
                className='flex-1 w-full bg-skin-bg-contrast-light text-skin-text text-sm border-none rounded-l-full p-sm'
                type='text'
                placeholder='Search people'
            />

            <button
                className='bg-skin-bg-contrast-light border-none px-sm rounded-r-full'
                type='button'
                aria-label='Search button'
            >
                <MdSearch className='text-lg text-skin-text-light' />
            </button>
        </form>
    );
}
