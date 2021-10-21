import { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    items: Array<string | number>;
}

export default function Select({ items, ...props }: Props) {
    return (
        <select {...props}>
            <option className="bg-skin-bg">{props.placeholder}</option>
            {items.map((item) => (
                <option key={item} className="bg-skin-bg" value={item}>{item}</option>
            ))}
        </select>
    );
}
