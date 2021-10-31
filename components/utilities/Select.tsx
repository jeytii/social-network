import { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    items: {
        label: string;
        value: string | number;
    }[];
}

export default function Select({ items, ...props }: Props) {
    return (
        <select {...props}>
            {!!props.placeholder && (
                <option className='bg-skin-bg'>{props.placeholder}</option>
            )}

            {items.map(({ label, value }) => (
                <option key={value} className='bg-skin-bg' value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
}
