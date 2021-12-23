import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import InputField from 'components/utilities/InputField';
import { axiosClient, axiosServer } from 'config/axios';
import type { User } from 'types/user';

interface FormDataError {
    username: string[];
    password: string[];
}

interface OkResponse {
    status: number;
    message: string;
    token: string;
    user: User;
}

const fields = {
    username: '',
    password: '',
};

export default function Index() {
    const [alertError, setAlertError] = useState<string | null>(null);
    const [codeResent, setCodeResent] = useState<boolean>(false);
    const [unauthorizedError, setUnauthorizedError] = useState<{
        username: string;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const {
        register,
        getValues,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: fields,
    });

    function processFormErrors(error: AxiosError) {
        const formErrors = error.response?.data.errors;
        const keys = Object.keys(fields);

        if (alertError) {
            setAlertError(null);
        }

        keys.forEach(key => {
            if (formErrors[key]) {
                setError(key as keyof FormDataError, {
                    type: 'manual',
                    message: formErrors[key][0],
                });
            } else {
                clearErrors(key as keyof FormDataError);
            }
        });
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            const { data } = await axiosClient().post<OkResponse>(
                '/login',
                getValues(),
            );

            clearErrors();
            setAlertError(null);

            Cookies.set('token', data.token);

            window.location.href = '/home';
        } catch (error) {
            const { status, data } = error.response;
            setLoading(false);

            if (status === 422) {
                processFormErrors(error);
            } else if (status === 401) {
                clearErrors();

                if (codeResent) {
                    setCodeResent(false);
                }

                if (alertError) {
                    setAlertError(null);
                }

                setUnauthorizedError(data.data);
            } else {
                clearErrors();

                if (unauthorizedError) {
                    setUnauthorizedError(null);
                }

                setAlertError(data.message);
            }
        }
    }

    async function resendVerificationCode() {
        setLoading(true);

        await axiosClient().post('/verify/resend', {
            username: unauthorizedError?.username,
        });

        setLoading(false);
        setUnauthorizedError(null);
        setCodeResent(true);
    }

    return (
        <div className='py-md'>
            <main className='max-w-[420px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                <h1 className='text-lg text-skin-text-light text-center'>
                    Sign in to your account
                </h1>

                {!!codeResent && (
                    <p className='bg-success-lighter text-md text-success p-md border-success rounded-md mt-lg'>
                        A verification code has successfully sent to you.
                    </p>
                )}

                {!!alertError && (
                    <p className='bg-danger-lighter text-md text-danger p-md border-danger rounded-md mt-lg'>
                        Incorrect username or password.
                    </p>
                )}

                {!!unauthorizedError && (
                    <div className='bg-danger-lighter text-danger p-md border-danger rounded-md mt-lg'>
                        <p className='text-md ml-sm'>
                            Please verify your account first before logging in.
                            If you did not receive a verification code,
                            <button
                                className='underline cursor-pointer hover:text-danger-dark disabled:cursor-not-allowed disabled:text-danger'
                                type='button'
                                disabled={loading}
                                onClick={resendVerificationCode}
                            >
                                click here
                            </button>
                            .
                        </p>
                    </div>
                )}

                <form className='py-sm' onSubmit={submit}>
                    <InputField
                        type='text'
                        label='Username or email address'
                        error={errors.username?.message}
                        disabled={loading}
                        {...register('username')}
                    />

                    <InputField
                        containerClassName='mt-md'
                        type='password'
                        label='Password'
                        error={errors.password?.message}
                        disabled={loading}
                        {...register('password')}
                    />

                    <button
                        type='submit'
                        className='button button-primary w-full py-sm mt-lg'
                        disabled={loading}
                    >
                        Sign in
                    </button>
                </form>

                <div className='text-center'>
                    <Link href='/register'>
                        <span className='inline-block text-primary text-md no-underline cursor-pointer'>
                            Create an account
                        </span>
                    </Link>
                </div>

                <div className='text-center mt-xs'>
                    <Link href='/forgot-password'>
                        <span className='inline-block text-skin-text-light text-md no-underline cursor-pointer'>
                            Forgot password
                        </span>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const props = {
        title: 'Welcome to Sosyal.me',
        isPrivate: false,
    };

    if (!req.cookies || !req.cookies.token) {
        return { props };
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
        return { props };
    }
};
