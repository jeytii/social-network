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
            <label className="text-skin-text text-sm font-bold" htmlFor={props.id}>
                {label}
            </label>

            <input className="textfield mt-xs" {...props} />

            {hasError && <p className="text-danger text-sm mt-xs mb-0">{error[0]}</p>}
        </section>
    );
}

InputField.defaultProps = {
    containerClassName: undefined,
};

export default InputField;
