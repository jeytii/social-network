interface Props {
    className?: string;
    id: string;
    type?: string;
    label: string;
}

function InputField({
    className, id, type, label,
}: Props) {
    return (
        <div className={className}>
            <label className="text-skin-text font-bold text-md" htmlFor={id}>
                {label}
            </label>

            <input
                className="block w-full bg-skin-bg-contrast text-skin-text p-sm rounded-md mt-xs"
                type={type}
                id={id}
            />
        </div>
    );
}

InputField.defaultProps = {
    className: '',
    type: 'text',
};

export default InputField;
