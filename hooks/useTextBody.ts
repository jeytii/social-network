import { ChangeEvent, KeyboardEvent, KeyboardEventHandler, Ref } from 'react';
import { ChangeHandler, useForm } from 'react-hook-form';

interface RegisterInput {
    onChange: ChangeHandler;
    onBlur: ChangeHandler;
    ref: Ref<HTMLTextAreaElement>;
    name: string;
}

type HookData = [
    {
        register: RegisterInput;
        values: { body: string };
        resetValue: CallableFunction;
    },
    KeyboardEventHandler<HTMLTextAreaElement>,
    number,
];

export default function useTextBody(value: string, maxLength = 300): HookData {
    const { register, watch, getValues, setValue } = useForm({
        defaultValues: {
            body: value,
        },
    });

    const { body } = watch();
    const charactersLeft = maxLength - body.length;

    function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const { target } = event;

        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
    }

    function checkTextBodyLength(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (charactersLeft > 0) {
            return true;
        }

        event.preventDefault();
    }

    function resetValue() {
        setValue('body', '');
    }

    return [
        {
            register: register('body', { onChange }),
            values: getValues(),
            resetValue,
        },
        checkTextBodyLength,
        charactersLeft,
    ];
}
