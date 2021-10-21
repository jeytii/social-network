import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string;
    label: string;
    error: string[] | null;
}

function InputField({
    containerClassName, label, error, ...props
}: Props) {
    const hasError = !!error && !!error.length;

    return (
        <section className={containerClassName}>
            <label className="text-skin-text font-bold text-md" htmlFor={props.id}>
                {label}
            </label>

            <input
                className="block w-full bg-skin-bg-contrast text-skin-text p-sm rounded-md mt-xs"
                {...props}
            />

            {hasError && <p className="text-danger text-sm mt-xs mb-0">{error[0]}</p>}
        </section>
    );
}

InputField.defaultProps = {
    containerClassName: '',
};

export default InputField;
