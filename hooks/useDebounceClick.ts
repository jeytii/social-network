import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type HookReturnType = [CallableFunction, (newCondition: boolean) => void];

export default function useDebounceClick(
    condition: boolean,
    postFn: CallableFunction,
    deleteFn: CallableFunction,
    delay = 500,
): HookReturnType {
    const ref = useRef<boolean>();
    const debounce = useDebouncedCallback(() => {
        if (ref.current !== condition) {
            if (condition) {
                postFn();
            } else {
                deleteFn();
            }
        }
    }, delay);

    const mutatePreviousState = (newCondition: boolean) => {
        ref.current = newCondition;
    };

    useEffect(() => {
        ref.current = condition;
    }, []);

    return [debounce, mutatePreviousState];
}
