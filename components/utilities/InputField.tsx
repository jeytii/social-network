import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string;
    label: string;
    error?: string;
}

const InputField = forwardRef(
    (
        { containerClassName, className, label, error, ...props }: Props,
        ref: ForwardedRef<HTMLInputElement>,
    ) => (
        <section className={containerClassName}>
            <label
                className='text-skin-primary text-md font-bold'
                htmlFor={props.id}
            >
                {label}
            </label>

            <input
                ref={ref}
                className={clsx(
                    'w-full bg-skin-main text-md text-skin-primary border p-sm rounded mt-xs disabled:opacity-50 disabled:cursor-not-allowed',
                    className,
                    error ? 'border-danger-light' : 'border-primary-light',
                )}
                {...props}
            />

            {!!error && (
                <p className='text-danger text-sm mt-xs mb-0'>{error}</p>
            )}
        </section>
    ),
);

InputField.defaultProps = {
    containerClassName: undefined,
    error: undefined,
};

export default InputField;
