import clsx from 'clsx';
import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import {
    MdOutlineRadioButtonUnchecked,
    MdOutlineRadioButtonChecked,
} from 'react-icons/md';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName: string;
    label: string;
}

function Radio(
    { containerClassName, label, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>,
) {
    return (
        <label
            className={clsx(
                containerClassName,
                props.disabled && 'opacity-50 cursor-not-allowed',
            )}
            htmlFor={props.id}
        >
            {props.checked ? (
                <MdOutlineRadioButtonChecked
                    className='text-primary-dark'
                    size={15}
                    viewBox='2 2 20 20'
                />
            ) : (
                <MdOutlineRadioButtonUnchecked
                    className='text-skin-primary'
                    size={15}
                    viewBox='2 2 20 20'
                />
            )}

            <input ref={ref} className='hidden' type='radio' {...props} />
            <span className='text-skin-primary text-md ml-xs'>{label}</span>
        </label>
    );
}

export default forwardRef(Radio);
