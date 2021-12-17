import { GetServerSideProps } from 'next';
import { FormEvent } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import InputField from 'components/utilities/InputField';
import { axiosClient, axiosServer } from 'config/axios';

interface RequestBody {
    email: string;
    password: string;
    password_confirmation: string;
}

interface Variables {
    url: string;
    data: RequestBody;
}

const fields = {
    email: '',
    password: '',
    password_confirmation: '',
};

export default function ResetPassword({ token }: { token: string }) {
    const { register, getValues, setError, clearErrors, formState } = useForm({
        defaultValues: { ...fields, token },
    });

    const { mutate, isLoading } = useMutation<
        AxiosResponse,
        AxiosError,
        Variables
    >('update', {
        onSuccess({ data }) {
            Cookies.set('token', data.token);
            window.location.href = '/home';
        },
        onError(error) {
            const e = error.response?.data.errors;
            const keys = Object.keys(fields);

            keys.forEach(key => {
                if (e[key]) {
                    setError(key as keyof RequestBody, {
                        type: 'manual',
                        message: e[key][0],
                    });
                } else {
                    clearErrors(key as keyof RequestBody);
                }
            });
        },
    });

    async function submit(event: FormEvent) {
        event.preventDefault();

        mutate({
            url: '/reset-password',
            data: getValues(),
        });
    }

    return (
        <div className='py-md'>
            <main className='max-w-[480px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                <h1 className='text-lg text-skin-text-light text-center'>
                    Reset your password
                </h1>

                <form className='mt-sm' onSubmit={submit}>
                    <InputField
                        id='email'
                        type='email'
                        label='Email address'
                        error={formState.errors.email?.message}
                        disabled={isLoading}
                        {...register('email')}
                    />
                    <InputField
                        containerClassName='mt-lg'
                        id='password'
                        type='password'
                        label='New password'
                        error={formState.errors.password?.message}
                        disabled={isLoading}
                        {...register('password')}
                    />
                    <InputField
                        containerClassName='mt-lg'
                        id='password_confirmation'
                        type='password'
                        label='Confirm new password'
                        disabled={isLoading}
                        error={formState.errors.password_confirmation?.message}
                        {...register('password_confirmation')}
                    />

                    <button
                        type='submit'
                        className='button button-primary w-full py-sm mt-lg'
                        disabled={isLoading}
                    >
                        Reset my password
                    </button>
                </form>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    params,
    req,
}) => {
    const props = {
        title: 'Reset password',
        isPrivate: false,
        token: params?.token,
    };

    if (!req.cookies || !req.cookies.token) {
        try {
            await axiosClient().get(`/reset-password/${params?.token}`);

            return { props };
        } catch (err) {
            return {
                notFound: true,
            };
        }
    }

    try {
        await axiosServer(req.cookies.token).get('/private');

        return {
            redirect: {
                destination: '/home',
                permanent: false,
            },
        };
    } catch (e) {
        try {
            await axiosClient().get(`/reset-password/${params?.token}`);

            return { props };
        } catch (err) {
            return {
                notFound: true,
            };
        }
    }
};
