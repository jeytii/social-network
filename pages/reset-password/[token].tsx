import { GetServerSideProps } from 'next';
import { FormEvent } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import InputField from 'components/utilities/InputField';
import Logo from 'components/Logo';
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
        <main className='max-w-[360px] bg-skin-main border border-skin-main rounded p-lg mx-auto mt-[40px]'>
            <div className='flex items-center justify-center'>
                <a href='/' className='no-underline'>
                    <Logo />
                </a>
            </div>

            <h1 className='text-md text-skin-secondary font-bold text-center mt-xs'>
                Reset password
            </h1>

            <form className='mt-lg' onSubmit={submit}>
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
                    className='button button-primary w-full rounded-full py-sm mt-lg'
                    disabled={isLoading}
                >
                    Change my password
                </button>
            </form>
        </main>
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
