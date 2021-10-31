import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

function Spinner({ className, size, ...props }: Props) {
    return (
        <div className={className} {...props}>
            <svg
                className='block m-auto'
                width={size}
                height={size}
                viewBox='0 0 100 100'
                preserveAspectRatio='xMidYMid'
            >
                <circle
                    className='stroke-current'
                    cx='50'
                    cy='50'
                    fill='none'
                    strokeWidth='10'
                    r='35'
                    strokeDasharray='164.93361431346415 56.97787143782138'
                >
                    <animateTransform
                        attributeName='transform'
                        type='rotate'
                        repeatCount='indefinite'
                        dur='1s'
                        values='0 50 50;360 50 50'
                        keyTimes='0;1'
                    />
                </circle>
            </svg>
        </div>
    );
}

Spinner.defaultProps = {
    size: 40,
};

export default Spinner;
