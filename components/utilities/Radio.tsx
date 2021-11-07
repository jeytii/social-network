import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import { BiRadioCircle, BiRadioCircleMarked } from 'react-icons/bi';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName: string;
    label: string;
}

export default forwardRef(
    (
        { containerClassName, label, ...props }: Props,
        ref: ForwardedRef<HTMLInputElement>,
    ) => (
        <label className={containerClassName} htmlFor={props.id}>
            {props.checked ? (
                <BiRadioCircleMarked className='text-skin-text text-xl' />
            ) : (
                <BiRadioCircle className='text-skin-text text-xl' />
            )}

            <input ref={ref} className='hidden' type='radio' {...props} />
            <span className='text-skin-text text-md ml-xs'>{label}</span>
        </label>
    ),
);
