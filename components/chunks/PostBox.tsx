import { InfiniteData, useMutation, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import useTextBody from 'hooks/useTextBody';
import axios from 'config/axios';
import type { PostPage } from 'types/page';
import type { Post } from 'types/post';

interface Variables {
    body: string;
}

interface ResponseBody {
    status: number;
    data: Post;
}

interface Props {
    rows?: number;
    buttonLabel: string;
    placeholder: string;
    value: string | null;
    apiUrl: string;
    apiMethod: 'post' | 'put';
    onSuccessEvent(
        current: InfiniteData<PostPage> | undefined,
        data: ResponseBody,
        variables: { body: string },
    ): InfiniteData<PostPage>;
}

const authToken = Cookies.get('token');

function PostBox({ apiUrl, apiMethod, onSuccessEvent, ...props }: Props) {
    const [hook, checkTextBodyLength, charactersLeft] = useTextBody(
        props.value || '',
    );

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation<
        { data: ResponseBody },
        unknown,
        Variables
    >(newPost => axios(authToken)[apiMethod](apiUrl, newPost), {
        onSuccess,
        retry: 3,
    });

    function onSuccess(
        { data }: { data: ResponseBody },
        variables: { body: string },
    ) {
        queryClient.setQueryData<InfiniteData<PostPage>>('posts', current =>
            onSuccessEvent(current, data, variables),
        );

        if (apiMethod === 'put') {
            queryClient.setQueryData('showEditPostModal', false);
        } else {
            hook.resetValue();
        }
    }

    function submit() {
        mutate(hook.values);
    }

    return (
        <form className='rounded-md bg-skin-bg-contrast'>
            <textarea
                className='block text-skin-text w-full transparent resize-none rounded-t-md p-md disabled:opacity-50 disabled:cursor-not-allowed'
                placeholder={props.placeholder}
                rows={props.rows}
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
                    {props.buttonLabel}
                </button>
            </div>
        </form>
    );
}

PostBox.defaultProps = {
    rows: 3,
};

export default PostBox;
