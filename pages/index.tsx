import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiErrorCircle } from 'react-icons/bi';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Public from 'components/Public';
import InputField from 'components/utilities/InputField';
import axios from 'config/axios';

interface IndexFormDataError {
    username: string[];
    password: string[];
}

interface OkResponse {
    status: number;
    message: string;
    token: string;
    user: {
        slug: string;
        name: string;
        username: string;
        gender: 'Male' | 'Female';
        image_url: string | null;
    };
}

const fields = {
    username: '',
    password: '',
};

export default function Index() {
    const [alertError, setAlertError] = useState<string | null>(null);
    const { replace } = useRouter();
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
        const { errors } = error.response?.data;
        const keys = Object.keys(fields);

        if (alertError) {
            setAlertError(null);
        }

        keys.forEach(key => {
            if (errors[key]) {
                setError(key as keyof IndexFormDataError, {
                    type: 'manual',
                    message: errors[key][0],
                });
            } else {
                clearErrors(key as keyof IndexFormDataError);
            }
        });
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

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
            if (error.response.status === 422) {
                processFormErrors(error);
            } else {
                clearErrors();
                setAlertError(error.response.data.message);
            }
        }
    }

    return (
        <Public title='Welcome to Sosyal.me'>
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
                            disabled
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
        </Public>
    );
}

export async function getServerSideProps({ req }) {
    if (!req.cookies || !req.cookies.token) {
        return {
            props: {},
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
            props: {},
        };
    }
}
