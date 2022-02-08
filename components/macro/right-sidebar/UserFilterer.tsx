import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Listbox } from '@headlessui/react';
import Radio from 'components/utilities/Radio';

interface Month {
    value: string;
    label: string;
}

const months = [
    // { value: '', label: 'Month' },
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

export default function UserFilterer() {
    const { query, push } = useRouter();
    const [month, setMonth] = useState<Month | null>(null);
    const [year, setYear] = useState<string>('');
    const [gender, setGender] = useState<'Male' | 'Female' | null>(null);

    function handleYearValue(event: ChangeEvent<HTMLInputElement>) {
        setYear(event.target.value);
    }

    function handleGenderValue(value: 'Male' | 'Female') {
        return () => {
            setGender(value);
        };
    }

    function resetValues() {
        setMonth(null);
        setYear('');
        setGender(null);
    }

    function filter() {
        const queries = new URLSearchParams();

        if (query.query && typeof query.query === 'string') {
            queries.append('query', query.query);
        }

        if (month) {
            queries.append('month', month.value);
        }

        if (year) {
            queries.append('year', year);
        }

        if (gender) {
            queries.append('gender', gender);
        }

        push(`/search?${queries}`);
    }

    return (
        <>
            <header className='flex items-center'>
                <h1 className='text-md text-skin-primary font-bold'>Filter</h1>
                <button
                    className='bg-none text-sm text-skin-secondary cursor-pointer ml-auto hover:text-skin-primary'
                    type='button'
                    onClick={resetValues}
                >
                    Reset
                </button>
            </header>

            <form className='mt-lg'>
                <div className='flex gap-sm'>
                    <Listbox value={month} onChange={setMonth}>
                        <div className='flex-1 relative'>
                            <Listbox.Button className='relative w-full bg-skin-main text-left border border-skin-main rounded py-xs px-md cursor-pointer'>
                                {!month ? (
                                    <Listbox.Label
                                        as='span'
                                        className='text-md text-skin-secondary'
                                    >
                                        Month
                                    </Listbox.Label>
                                ) : (
                                    <span className='text-md text-skin-primary'>
                                        {month.label}
                                    </span>
                                )}

                                <span className='absolute inset-y-[0px] right-[10px] flex items-center pr-2 pointer-events-none'>
                                    <MdKeyboardArrowDown
                                        className='text-lg text-skin-secondary'
                                        aria-hidden='true'
                                    />
                                </span>
                            </Listbox.Button>

                            <Listbox.Options className='absolute right-[0px] top-[100%] w-full mt-xs overflow-auto bg-skin rounded ring-1 ring-skin-secondary ring-opacity-5 z-10'>
                                {months.map(m => (
                                    <Listbox.Option key={m.value} value={m}>
                                        <div className='p-xs cursor-pointer hover:bg-skin-main hover:font-bold'>
                                            <span className='text-md text-skin-primary ml-xs'>
                                                {m.label}
                                            </span>
                                        </div>
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>

                    <input
                        className='bg-skin-main text-md text-skin-primary border border-skin-main rounded p-xs'
                        type='number'
                        placeholder='Year'
                        min={maxYear - 100}
                        max={maxYear}
                        value={year}
                        onChange={handleYearValue}
                    />
                </div>

                <div className='flex items-center mt-lg'>
                    <Radio
                        containerClassName='flex items-center cursor-pointer'
                        id='male'
                        label='Male'
                        value='Male'
                        checked={gender === 'Male'}
                        onChange={handleGenderValue('Male')}
                    />

                    <Radio
                        containerClassName='flex items-center cursor-pointer ml-xl'
                        id='female'
                        label='Female'
                        value='Female'
                        checked={gender === 'Female'}
                        onChange={handleGenderValue('Female')}
                    />
                </div>

                <button
                    className='button button-primary w-full rounded-full text-md py-sm mt-lg'
                    type='button'
                    disabled={!month && !year.length && !gender}
                    onClick={filter}
                >
                    Filter results
                </button>
            </form>
        </>
    );
}
