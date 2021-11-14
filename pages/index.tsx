import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import InputField from 'components/utilities/InputField';
import axios from 'config/axios';
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
    const { replace } = useRouter();
    const {
        register,
        watch,
        getValues,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: fields,
    });

    const [username, password] = watch(['username', 'password']);

    function processFormErrors(error: AxiosError) {
        const { errors } = error.response?.data;
        const keys = Object.keys(fields);

        if (alertError) {
            setAlertError(null);
        }

        keys.forEach(key => {
            if (errors[key]) {
                setError(key as keyof FormDataError, {
                    type: 'manual',
                    message: errors[key][0],
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
            const { data } = await axios().post<OkResponse>(
                '/login',
                getValues(),
            );

            clearErrors();
            setAlertError(null);

            Cookies.set('user', JSON.stringify(data.user));
            Cookies.set('token', data.token);

            replace('/home');
        } catch (error: AxiosError) {
            setLoading(false);

            if (error.response?.status === 422) {
                processFormErrors(error);
            } else if (error.response?.status === 401) {
                clearErrors();

                if (codeResent) {
                    setCodeResent(false);
                }

                if (alertError) {
                    setAlertError(null);
                }

                setUnauthorizedError(error.response?.data.data);
            } else {
                clearErrors();

                if (unauthorizedError) {
                    setUnauthorizedError(null);
                }

                setAlertError(error.response?.data.message);
            }
        }
    }

    async function resendVerificationCode(method: 'email' | 'sms') {
        setLoading(true);

        await axios().post('/verify/resend', {
            username: unauthorizedError?.username,
            method,
        });

        setLoading(false);
        setUnauthorizedError(null);
        setCodeResent(true);
    }

    return (
        <div className='py-md'>
            <main className='max-w-[480px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                <h1 className='text-lg font-bold text-skin-text-light text-center'>
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
                            If you did not receive a verification code, request
                            for another one through{' '}
                            <button
                                className='underline cursor-pointer hover:text-danger-dark disabled:cursor-not-allowed disabled:text-danger'
                                type='button'
                                disabled={loading}
                                onClick={resendVerificationCode.bind(
                                    null,
                                    'email',
                                )}
                            >
                                email address
                            </button>{' '}
                            or{' '}
                            <button
                                className='underline cursor-pointer hover:text-danger-dark disabled:cursor-not-allowed disabled:text-danger'
                                type='button'
                                disabled={loading}
                                onClick={resendVerificationCode.bind(
                                    null,
                                    'sms',
                                )}
                            >
                                SMS
                            </button>
                            .
                        </p>
                    </div>
                )}

                <form className='py-lg' onSubmit={submit}>
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
                        className='btn-primary w-full text-md mt-lg'
                        disabled={
                            !username.length || !password.length || loading
                        }
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

                <div className='text-center mt-sm'>
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
    if (!req.cookies || !req.cookies.token) {
        return {
            props: {
                title: 'Welcome to Sosyal.me',
                isPrivate: false,
            },
        };
    }

    try {
        await axios(req.cookies.token).get(`${process.env.APP_URL}/private`);

        return {
            redirect: {
                destination: '/home',
                permanent: false,
            },
        };
    } catch (e) {
        return {
            props: {
                title: 'Welcome to Sosyal.me',
                isPrivate: false,
            },
        };
    }
};
