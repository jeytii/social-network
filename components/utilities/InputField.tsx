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
                className='text-skin-text text-md font-bold'
                htmlFor={props.id}
            >
                {label}
            </label>

            <input
                ref={ref}
                className={clsx(
                    'w-full bg-skin-bg-contrast text-md text-skin-text border p-sm rounded-md mt-xs disabled:opacity-50 disabled:cursor-not-allowed',
                    className,
                    error ? 'border-danger' : 'border-skin-bg-contrast',
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
    error: null,
};

export default InputField;
