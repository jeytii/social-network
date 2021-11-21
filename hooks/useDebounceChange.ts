import { useEffect } from 'react';

export default function useDebounceChange(
    value: string,
    successFn: CallableFunction,
    resetFn: CallableFunction,
    delay = 500,
) {
    useEffect(() => {
        if (value.length) {
            const handler = setTimeout(() => {
                successFn();
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }

        resetFn();
    }, [value]);
}
