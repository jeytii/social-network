import { InputHTMLAttributes } from 'react';
import { BiRadioCircle, BiRadioCircleMarked } from 'react-icons/bi';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName: string;
    label: string;
}

export default function Radio({
    containerClassName, label, ...props
}: Props) {
    return (
        <label className={containerClassName} htmlFor={props.id}>
            {props.checked ? (
                <BiRadioCircleMarked className="text-skin-text text-xl" />
            ) : (
                <BiRadioCircle className="text-skin-text text-xl" />
            )}

            <input className="hidden" type="radio" {...props} />
            <span className="text-skin-text text-sm ml-xs">{label}</span>
        </label>
    );
}
