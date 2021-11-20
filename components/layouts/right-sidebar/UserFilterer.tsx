import Select from 'components/utilities/Select';
import Radio from 'components/utilities/Radio';

const months = [
    { label: 'Month', value: '' },
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
];

export default function UserFilterer() {
    return (
        <aside className='w-[280px] sticky top-[59.5px] full-height left-[0px] bg-skin-bg-contrast-light p-lg'>
            <header className='flex items-center'>
                <h1 className='text-md text-skin-text font-bold'>Filter</h1>
                <button
                    className='bg-none text-sm text-skin-text-light cursor-pointer ml-auto hover:text-skin-text'
                    type='button'
                >
                    Reset
                </button>
            </header>

            <form className='mt-lg'>
                <div className='flex gap-sm'>
                    <Select
                        className='bg-skin-bg-contrast rounded-md text-sm text-skin-text cursor-pointer p-xs'
                        items={months}
                    />

                    <input
                        className='bg-skin-bg-contrast text-sm text-skin-text rounded-md p-xs'
                        type='number'
                        placeholder='Day'
                        min='1'
                        max='31'
                    />

                    <input
                        className='bg-skin-bg-contrast text-sm text-skin-text rounded-md p-xs'
                        type='number'
                        placeholder='Year'
                        min='1990'
                        max='2021'
                    />
                </div>

                <div className='flex items-center mt-lg'>
                    <Radio
                        containerClassName='flex items-center cursor-pointer'
                        id='male'
                        label='Male'
                        name='gender'
                        value='Male'
                        checked={false}
                    />

                    <Radio
                        containerClassName='flex items-center cursor-pointer ml-xl'
                        id='female'
                        label='Female'
                        name='gender'
                        value='Female'
                        checked={false}
                    />
                </div>

                <button
                    className='button button-primary w-full text-sm mt-lg'
                    type='submit'
                    disabled
                >
                    Filter results
                </button>
            </form>
        </aside>
    );
}
