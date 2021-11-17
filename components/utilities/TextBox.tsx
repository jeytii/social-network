import { useMutation } from 'react-query';
import Cookies from 'js-cookie';
import useTextBody from 'hooks/useTextBody';
import axios from 'config/axios';
import { Post } from 'types/post';

interface SuccessEventData {
    data: {
        status: number;
        data: Post;
    };
}

interface Props {
    buttonLabel: string | undefined;
    value: string | undefined;
    placeholder: string | undefined;
    rows?: number;
    apiUrl: string | undefined;
    apiMethod: 'post' | 'put';
    successEvent(
        response: SuccessEventData | never,
        variables: { body: string },
    ): void;
}

const authToken = Cookies.get('token');

function TextBox({
    buttonLabel,
    value,
    placeholder,
    rows,
    apiUrl,
    apiMethod,
    successEvent,
}: Props) {
    const [hook, checkTextBodyLength, charactersLeft] = useTextBody(
        value || '',
    );
    const { mutate, isLoading } = useMutation<SuccessEventData | never>(
        () => axios(authToken)[apiMethod](apiUrl as string, hook.values),
        {
            onSuccess(response) {
                successEvent(response, hook.values);
                hook.resetValue();
            },
            retry: 3,
        },
    );

    function submit() {
        mutate();
    }

    return (
        <form className='rounded-md bg-skin-bg-contrast'>
            <textarea
                className='block text-skin-text w-full transparent resize-none rounded-t-md p-md disabled:opacity-50 disabled:cursor-not-allowed'
                rows={rows}
                placeholder={placeholder}
                disabled={isLoading}
                onKeyPress={checkTextBodyLength}
                {...hook.register}
            />

            <div className='flex items-center py-sm px-md bg-skin-bg-contrast-light rounded-b-md'>
                <span
                    className='text-sm text-primary'
                    aria-label='Characters left'
                >
                    {charactersLeft}
                </span>
                <button
                    className='button button-primary text-sm rounded-full ml-auto'
                    type='button'
                    disabled={isLoading || charactersLeft === 300}
                    onClick={submit}
                >
                    {buttonLabel}
                </button>
            </div>
        </form>
    );
}

TextBox.defaultProps = {
    rows: 3,
};

export default TextBox;