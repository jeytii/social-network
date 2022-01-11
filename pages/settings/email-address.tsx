import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import InputField from 'components/utilities/InputField';
import { axiosServer } from 'config/axios';

interface Variables {
    url: string;
    data: {
        email: string;
        password: string;
    };
}

export default function ChangeEmailAddress({ email }: { email: string }) {
    const [errorAlert, setErrorAlert] = useState<string | null>(null);
    const { mutate, isLoading } = useMutation<unknown, AxiosError, Variables>(
        'update',
        { onSuccess, onError },
    );
    const { register, getValues, watch, setError, clearErrors, formState } =
        useForm({
            defaultValues: { email, password: '' },
        });

    const [emailAddress, password] = watch(['email', 'password']);

    function onError(error: AxiosError) {
        if (error.response?.status === 422) {
            const { errors } = error.response.data;
            const keys: ['email', 'password'] = ['email', 'password'];

            if (errorAlert) {
                setErrorAlert(null);
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
        } else {
            clearErrors();
            setErrorAlert(error.response?.data.message);
        }
    }

    function onSuccess() {
        if (errorAlert) {
            setErrorAlert(null);
        }

        clearErrors();

        window.location.href = '/settings';
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        mutate({
            url: '/api/settings/change/email',
            data: getValues(),
        });
    }

    return (
        <section className='max-w-[480px] p-lg m-auto'>
            {errorAlert && errorAlert.length && (
                <p className='bg-danger-light text-md text-danger rounded p-sm mb-lg'>
                    {errorAlert}
                </p>
            )}

            <form onSubmit={submit}>
                <InputField
                    className='text-md'
                    id='email'
                    type='text'
                    label='Email address'
                    disabled={isLoading}
                    error={formState.errors.email?.message}
                    autoFocus
                    {...register('email')}
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
                    className='button button-primary w-full rounded-full py-sm mt-lg'
                    type='submit'
                    disabled={
                        isLoading ||
                        !emailAddress.length ||
                        !password.length ||
                        (!!emailAddress.length && emailAddress === email)
                    }
                >
                    Update my email address
                </button>
            </form>
        </section>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const defaultReturn = {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };

    if (!req.cookies || !req.cookies.token) {
        return defaultReturn;
    }

    try {
        const responses = await Promise.all([
            axiosServer(req.cookies.token).get('/private'),
            axiosServer(req.cookies.token).get('/api/notifications/count'),
        ]);

        return {
            props: {
                title: 'Change email address',
                isPrivate: true,
                user: responses[0].data.data,
                email: responses[0].data.data.email,
                notificationsCount: responses[1].data.data,
            },
        };
    } catch (e) {
        return defaultReturn;
    }
};
