import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiErrorCircle } from 'react-icons/bi';
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
    const [loading, setLoading] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<string | null>(null);
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

            if (error.response.status === 422) {
                processFormErrors(error);
            } else {
                clearErrors();
                setAlertError(error.response.data.message);
            }
        }
    }

    return (
        <div className='py-md'>
            <main className='max-w-[480px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                <h1 className='text-lg font-bold text-skin-text-light text-center'>
                    Sign in to your account
                </h1>

                {!!alertError && (
                    <div className='flex items-center bg-danger-lighter text-danger p-md border-danger rounded-md mt-lg'>
                        <BiErrorCircle className='text-xl' />
                        <span className='text-md ml-sm'>
                            Incorrect combination
                        </span>
                    </div>
                )}

                <form className='py-lg' onSubmit={submit}>
                    <InputField
                        type='text'
                        label='Username or email address'
                        error={errors.username?.message}
                        {...register('username')}
                    />

                    <InputField
                        containerClassName='mt-md'
                        type='password'
                        label='Password'
                        error={errors.password?.message}
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
