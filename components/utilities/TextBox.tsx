import { useMutation } from 'react-query';
import useTextBody from 'hooks/useTextBody';
import { Post } from 'types/post';

interface Variables {
    url: string;
    data: {
        body: string;
    };
}

interface ResponseData {
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
        response: ResponseData | never,
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
    const { mutate, isLoading } = useMutation<
        ResponseData | never,
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
        <form className='rounded bg-skin-main border border-skin-main'>
            <textarea
                className='block text-md text-skin-primary w-full transparent resize-none rounded-t-md p-md disabled:opacity-50 disabled:cursor-not-allowed'
                rows={3}
                placeholder={placeholder}
                disabled={isLoading}
                onKeyPress={checkTextBodyLength}
                {...hook.register}
            />

            <div className='flex items-center border-t border-skin-main rounded-b py-sm px-md'>
                <span
                    className='text-sm text-primary-dark'
                    aria-label='Characters left'
                >
                    {charactersLeft}
                </span>

                <button
                    className='button button-primary text-sm rounded-full ml-auto py-xs px-lg'
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
