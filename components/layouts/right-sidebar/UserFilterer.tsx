import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Select from 'components/utilities/Select';
import Radio from 'components/utilities/Radio';

const months = [
    { value: '', label: 'Month' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const maxYear = new Date().getFullYear();

const values = {
    month: '',
    year: '',
    gender: null,
};

export default function UserFilterer() {
    const { query, push } = useRouter();
    const { register, watch, getValues, reset } = useForm({
        defaultValues: values,
    });

    const body = watch();
    const allBlank = Object.values(body).every(value => !value);

    function resetValues() {
        reset();
    }

    function filter() {
        const request = Object.entries(getValues());
        const queries = new URLSearchParams();

        if (query.query && typeof query.query === 'string') {
            queries.append('query', query.query);
        }

        request.forEach(item => {
            if (!!item[1] || item[1]?.length) {
                queries.append(item[0], item[1]);
            }
        });

        push(`/search?${queries}`);
    }

    return (
        <aside className='w-[280px] sticky top-[59.5px] full-height left-[0px] bg-skin-bg-contrast-light p-lg'>
            <header className='flex items-center'>
                <h1 className='text-md text-skin-text font-bold'>Filter</h1>
                <button
                    className='bg-none text-sm text-skin-text-light cursor-pointer ml-auto hover:text-skin-text'
                    type='button'
                    onClick={resetValues}
                >
                    Reset
                </button>
            </header>

            <form className='mt-lg'>
                <div className='flex gap-sm'>
                    <Select
                        className='flex-1 bg-skin-bg-contrast rounded-md text-sm text-skin-text cursor-pointer p-xs'
                        items={months}
                        {...register('month')}
                    />

                    <input
                        className='bg-skin-bg-contrast text-sm text-skin-text rounded-md p-xs'
                        type='number'
                        placeholder='Year'
                        min={maxYear - 100}
                        max={maxYear}
                        {...register('year')}
                    />
                </div>

                <div className='flex items-center mt-lg'>
                    <Radio
                        containerClassName='flex items-center cursor-pointer'
                        id='male'
                        label='Male'
                        value='Male'
                        checked={body.gender === 'Male'}
                        {...register('gender')}
                    />

                    <Radio
                        containerClassName='flex items-center cursor-pointer ml-xl'
                        id='female'
                        label='Female'
                        value='Female'
                        checked={body.gender === 'Female'}
                        {...register('gender')}
                    />
                </div>

                <button
                    className='button button-primary w-full text-sm mt-lg'
                    type='button'
                    disabled={allBlank}
                    onClick={filter}
                >
                    Filter results
                </button>
            </form>
        </aside>
    );
}
