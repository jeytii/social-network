import { KeyboardEvent, KeyboardEventHandler, Ref } from 'react';
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

export default function useTextBody(maxLength = 300): HookData {
    const { register, watch, getValues, setValue } = useForm({
        defaultValues: {
            body: '',
        },
    });

    const { body } = watch();
    const charactersLeft = maxLength - body.length;

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
            register: register('body'),
            values: getValues(),
            resetValue,
        },
        checkTextBodyLength,
        charactersLeft,
    ];
}
