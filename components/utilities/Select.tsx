import { ForwardedRef, forwardRef, SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    items: {
        label: string;
        value: string | number;
    }[];
}

function Select(
    { items, ...props }: Props,
    ref: ForwardedRef<HTMLSelectElement>,
) {
    return (
        <select ref={ref} {...props}>
            {!!props.placeholder && (
                <option className='bg-skin-main'>{props.placeholder}</option>
            )}

            {items.map(({ label, value }) => (
                <option key={value} className='bg-skin-main' value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
}

export default forwardRef(Select);
