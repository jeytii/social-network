import { Control, FieldPathWithValue, useController } from 'react-hook-form';
import clsx from 'clsx';

interface IndexFormData {
    username: string;
    password: string;
}

interface Props {
    containerClassName?: string;
    className?: string;
    type: string;
    label: string;
    name: FieldPathWithValue<IndexFormData, any, keyof IndexFormData>;
    control: Control<IndexFormData>;
}

function InputField({
    containerClassName,
    className,
    type,
    label,
    name,
    control,
}: Props) {
    const { field, fieldState } = useController({ name, control });

    return (
        <section className={containerClassName}>
            <label className='text-skin-text text-md font-bold' htmlFor={name}>
                {label}
            </label>

            <input
                className={clsx(
                    'w-full bg-skin-bg-contrast text-skin-text border p-sm rounded-md mt-xs',
                    className,
                    fieldState.error
                        ? 'border-danger'
                        : 'border-skin-bg-contrast',
                )}
                id={name}
                type={type}
                {...field}
            />

            {!!fieldState.error && (
                <p className='text-danger text-sm mt-xs mb-0'>
                    {fieldState.error.message}
                </p>
            )}
        </section>
    );
}

InputField.defaultProps = {
    containerClassName: undefined,
    className: undefined,
};

export default InputField;
