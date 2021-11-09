import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Public from 'components/Public';
import InputField from 'components/utilities/InputField';
import axios from 'config/axios';

interface FormDataError {
    email: string[];
    password: string[];
    password_confirmation: string[];
}

const fields = {
    email: '',
    password: '',
    password_confirmation: '',
};

export default function ResetPassword({ token }: { token: string }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { replace } = useRouter();
    const { register, getValues, setError, clearErrors, formState } = useForm({
        defaultValues: { ...fields, token },
    });

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            const { data } = await axios().put('/reset-password', getValues());

            Cookies.set('user', JSON.stringify(data.user));
            Cookies.set('token', data.token);

            replace('/home');
        } catch (error) {
            const { errors } = (error as AxiosError).response?.data;
            const keys = Object.keys(fields);

            setLoading(false);

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
    }

    return (
        <Public title='Reset password - Sosyal.me'>
            <div className='py-md'>
                <main className='max-w-[480px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                    <h1 className='text-lg font-bold text-skin-text-light text-center'>
                        Reset your password
                    </h1>

                    <form className='mt-lg' onSubmit={submit}>
                        <InputField
                            id='email'
                            type='email'
                            label='Email address'
                            error={formState.errors.email?.message}
                            disabled={loading}
                            {...register('email')}
                        />
                        <InputField
                            containerClassName='mt-lg'
                            id='password'
                            type='password'
                            label='New password'
                            error={formState.errors.password?.message}
                            disabled={loading}
                            {...register('password')}
                        />
                        <InputField
                            containerClassName='mt-lg'
                            id='password_confirmation'
                            type='password'
                            label='Confirm new password'
                            disabled={loading}
                            error={
                                formState.errors.password_confirmation?.message
                            }
                            {...register('password_confirmation')}
                        />

                        <button
                            type='submit'
                            className='btn-primary w-full text-md mt-lg'
                            disabled={loading}
                        >
                            Reset my password
                        </button>
                    </form>
                </main>
            </div>
        </Public>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    params,
    req,
}) => {
    if (!req.cookies || !req.cookies.token) {
        try {
            await axios().get(`/reset-password/${params?.token}`);

            return {
                props: {
                    token: params?.token,
                },
            };
        } catch (err) {
            return {
                notFound: true,
            };
        }
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
        try {
            await axios().get(`/reset-password/${params?.token}`);

            return {
                props: {
                    token: params?.token,
                },
            };
        } catch (err) {
            return {
                notFound: true,
            };
        }
    }
};
