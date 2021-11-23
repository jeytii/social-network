import { ForwardedRef, forwardRef, SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    items: {
        label: string;
        value: string | number;
    }[];
}

const Select = forwardRef(
    ({ items, ...props }: Props, ref: ForwardedRef<HTMLSelectElement>) => {
        return (
            <select ref={ref} {...props}>
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
    },
);

export default Select;
