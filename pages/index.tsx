import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import InputField from 'components/utilities/InputField';
import Logo from 'components/Logo';
import authenticate from 'lib/auth';

interface LoginVariables {
    url: string;
    data: {
        username: string;
        password: string;
    };
}

interface ResendVariables {
    url: string;
    data: {
        username: string;
    };
}

interface FormDataError {
    username: string[];
    password: string[];
}

type UnauthorizedError = { username: string } | null;

export default function Index() {
    const [alertError, setAlertError] = useState<string | null>(null);
    const [codeResent, setCodeResent] = useState<boolean>(false);
    const [unauthorizedError, setUnauthorizedError] =
        useState<UnauthorizedError>(null);

    const { register, getValues, setError, clearErrors, formState } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const { mutate: login, isLoading: loadingLogin } = useMutation<
        AxiosResponse,
        AxiosError,
        LoginVariables
    >('create', {
        onSuccess({ data }) {
            clearErrors();
            setAlertError(null);

            Cookies.set('token', data.token);

            window.location.href = '/home';
        },
        onError({ response }) {
            if (response?.status === 422) {
                set422Errors(response.data.errors);
            } else if (response?.status === 401) {
                set401Error(response.data.data);
            } else {
                set404Error(response?.data.message);
            }
        },
    });

    const { mutate: resend, isLoading: loadingResend } = useMutation<
        AxiosResponse,
        AxiosError,
        ResendVariables
    >('create', {
        onSuccess() {
            setUnauthorizedError(null);
            setCodeResent(true);
        },
    });

    function set404Error(error: string | null) {
        clearErrors();

        if (unauthorizedError) {
            setUnauthorizedError(null);
        }

        setAlertError(error);
    }

    function set401Error(error: UnauthorizedError) {
        clearErrors();

        if (codeResent) {
            setCodeResent(false);
        }

        if (alertError) {
            setAlertError(null);
        }

        setUnauthorizedError(error);
    }

    function set422Errors(errors: FormDataError) {
        const keys: Array<keyof FormDataError> = ['username', 'password'];

        if (alertError) {
            setAlertError(null);
        }

        keys.forEach(key => {
            if (errors[key]) {
                setError(key, {
                    type: 'manual',
                    message: errors[key][0],
                });
            } else {
                clearErrors(key);
            }
        });
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        login({
            url: '/login',
            data: getValues(),
        });
    }

    async function resendVerificationCode() {
        resend({
            url: '/verify/resend',
            data: {
                username: unauthorizedError?.username as string,
            },
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
                Sign in to your account
            </h1>

            {!!codeResent && (
                <p className='bg-success-transparent paragraph-sm text-success-dark p-sm border border-success rounded mt-lg'>
                    A verification code has been successfully sent to your email
                    address.
                </p>
            )}

            {!!alertError && (
                <p className='bg-danger-transparent text-danger-dark text-sm p-sm border border-danger rounded mt-lg'>
                    {alertError}
                </p>
            )}

            {!!unauthorizedError && (
                <div className='bg-danger-transparent text-danger-dark p-sm border border-danger rounded mt-lg'>
                    <p className='paragraph-sm'>
                        Please verify your account first before logging in. If
                        you did not receive a verification code,
                        <button
                            className='underline cursor-pointer  disabled:cursor-not-allowed disabled:text-danger-light'
                            type='button'
                            disabled={loadingResend}
                            onClick={resendVerificationCode}
                        >
                            click here
                        </button>
                        .
                    </p>
                </div>
            )}

            <form className='py-lg' onSubmit={submit}>
                <InputField
                    type='text'
                    label='Username or email address'
                    error={formState.errors.username?.message}
                    disabled={loadingLogin}
                    {...register('username')}
                />

                <InputField
                    containerClassName='mt-lg'
                    type='password'
                    label='Password'
                    error={formState.errors.password?.message}
                    disabled={loadingLogin}
                    {...register('password')}
                />

                <button
                    type='submit'
                    className='button button-primary w-full rounded-full py-sm mt-lg'
                    disabled={loadingLogin}
                >
                    Sign in
                </button>
            </form>

            <div className='text-center'>
                <a
                    className='inline-block text-primary-dark text-md no-underline cursor-pointer hover:underline'
                    href='/register'
                >
                    Create an account
                </a>
            </div>

            <div className='text-center mt-xs'>
                <a
                    className='inline-block text-skin-secondary text-md no-underline cursor-pointer hover:underline'
                    href='/forgot-password'
                >
                    Forgot password
                </a>
            </div>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('guest', props, {
        title: "JT's Social Network",
    });
