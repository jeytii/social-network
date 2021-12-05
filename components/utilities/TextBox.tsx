import { useMutation } from 'react-query';
import useTextBody from 'hooks/useTextBody';
import { Post } from 'types/post';
import clsx from 'clsx';

interface Variables {
    url: string;
    data: {
        body: string;
    };
}

interface SuccessEventData {
    data: {
        status: number;
        data: Post;
    };
}

interface Props {
    buttonLabel: string;
    value: string;
    placeholder?: string;
    apiUrl: string;
    apiMethod: 'post' | 'put';
    onSuccess(
        response: SuccessEventData | never,
        variables: { body: string },
    ): void;
}

export default function TextBox({
    buttonLabel,
    value,
    placeholder,
    apiUrl,
    apiMethod,
    onSuccess,
}: Props) {
    const [hook, checkTextBodyLength, charactersLeft] = useTextBody(
        value || '',
    );
    const { mutate, isLoading, isError } = useMutation<
        SuccessEventData | never,
        unknown,
        Variables
    >(apiMethod === 'put' ? 'update' : 'create', {
        onSuccess(response, variables) {
            onSuccess(response, variables.data);

            if (apiMethod === 'post') {
                hook.resetValue();
            }
        },
    });

    function submit() {
        mutate({
            url: apiUrl,
            data: hook.values,
        });
    }

    return (
        <form
            className={clsx(
                'rounded-md bg-skin-bg-contrast-light border',
                isError ? 'border-danger' : 'border-skin-bg-contrast',
            )}
        >
            <textarea
                className='block text-md text-skin-text w-full transparent resize-none rounded-t-md p-md disabled:opacity-50 disabled:cursor-not-allowed'
                rows={3}
                placeholder={placeholder}
                disabled={isLoading}
                onKeyPress={checkTextBodyLength}
                {...hook.register}
            />

            <div className='flex items-center bg-skin-bg-contrast-light rounded-b-md'>
                <span
                    className='text-sm text-primary ml-md'
                    aria-label='Characters left'
                >
                    {charactersLeft}
                </span>
                <button
                    className='button text-primary text-sm ml-auto py-sm px-lg hover:text-primary-dark'
                    type='button'
                    disabled={
                        isLoading ||
                        charactersLeft === 300 ||
                        (apiMethod === 'put' && hook.values.body === value)
                    }
                    onClick={submit}
                >
                    {buttonLabel}
                </button>
            </div>
        </form>
    );
}

TextBox.defaultProps = {
    placeholder: "What's on your mind?",
};
