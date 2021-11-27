import { ChangeEvent, HTMLAttributes } from 'react';
import { useRouter } from 'next/router';
import Select from './Select';

const items = [
    { label: 'Most recent', value: 'created_at' },
    { label: 'Most liked', value: 'likes' },
];

export default function SortOptions(props: HTMLAttributes<HTMLElement>) {
    const { query, replace } = useRouter();

    function changeSortType(event: ChangeEvent<HTMLSelectElement>) {
        replace(`/home?sort=${event.target.value}`);
    }

    return (
        <div {...props}>
            <span className='text-skin-text text-sm'>Sort by:</span>
            <Select
                className='text-skin-text-light text-sm bg-skin-bg ml-sm cursor-pointer'
                items={items}
                value={query.sort || 'created_at'}
                onChange={changeSortType}
            />
        </div>
    );
}
