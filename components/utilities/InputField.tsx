import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string;
    label: string;
    error: string[] | null;
}

function InputField({
    containerClassName,
    className,
    label,
    error,
    ...props
}: Props) {
    const hasError = !!error && !!error.length;

    return (
        <section className={containerClassName}>
            <label
                className='text-skin-text text-md font-bold'
                htmlFor={props.id}
            >
                {label}
            </label>

            <input className={clsx('textfield mt-xs', className)} {...props} />

            {hasError && (
                <p className='text-danger text-sm mt-xs mb-0'>{error[0]}</p>
            )}
        </section>
    );
}

InputField.defaultProps = {
    containerClassName: undefined,
};

export default InputField;
