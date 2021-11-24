import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import InputField from 'components/utilities/InputField';
import { axiosServer } from 'config/axios';

interface User {
    slug: string;
    email: string;
    username: string;
    phone_number: string;
    gender: string;
    image_url: string | null;
}

interface Variables {
    url: string;
    data: {
        username: string;
        password: string;
    };
}

export default function ChangeUsername({ user }: { user: User }) {
    const [errorAlert, setErrorAlert] = useState<string | null>(null);
    const values = {
        username: user.username,
        password: '',
    };

    const { register, getValues, setError, clearErrors, formState } = useForm({
        defaultValues: values,
    });

    const { mutate, isLoading } = useMutation<unknown, AxiosError, Variables>(
        'update',
        {
            onSuccess() {
                window.location.href = '/settings';
            },
            onError(error) {
                if (error.response?.status === 422) {
                    const { errors } = error.response.data;
                    const keys = Object.keys(values);

                    keys.forEach(key => {
                        if (errors[key]) {
                            setError(key as 'username' | 'password', {
                                type: 'manual',
                                message: errors[key][0],
                            });
                        } else {
                            clearErrors(key as 'username' | 'password');
                        }
                    });
                } else {
                    setErrorAlert(error.response?.data.message);
                }
            },
        },
    );

    async function submit(event: FormEvent) {
        event.preventDefault();

        mutate({
            url: '/api/settings/change/username',
            data: getValues(),
        });
    }

    return (
        <section className='p-lg'>
            {errorAlert && errorAlert.length && (
                <p className='bg-danger-light text-md text-danger rounded-md p-sm mb-lg'>
                    {errorAlert}
                </p>
            )}

            <form onSubmit={submit}>
                <InputField
                    className='text-md'
                    id='username'
                    type='text'
                    label='Username'
                    disabled={isLoading}
                    error={formState.errors.username?.message}
                    autoFocus
                    {...register('username')}
                />

                <InputField
                    containerClassName='mt-lg'
                    className='text-md'
                    id='password'
                    type='password'
                    label='Password'
                    disabled={isLoading}
                    error={formState.errors.password?.message}
                    {...register('password')}
                />

                <button
                    className='button button-primary w-full py-sm mt-lg'
                    type='submit'
                    disabled={isLoading}
                >
                    Update my username
                </button>
            </form>
        </section>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    if (!req.cookies || !req.cookies.token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        const { data } = await axiosServer(req.cookies.token).get('/private');

        return {
            props: {
                title: 'Change username',
                isPrivate: true,
                user: data.user,
            },
        };
    } catch (e) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};
