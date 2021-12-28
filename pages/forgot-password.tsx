import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import InputField from 'components/utilities/InputField';
import Logo from 'components/Logo';
import { axiosServer } from 'config/axios';

interface AlertNotification {
    status: number;
    message: string;
}

interface FieldValues {
    email: string;
}

interface Variables {
    url: string;
    data: FieldValues;
}

export default function ForgotPassword() {
    const [alertNotification, setAlertNotification] =
        useState<AlertNotification | null>(null);

    const { register, getValues, setError, clearErrors, formState } =
        useForm<FieldValues>({
            defaultValues: {
                email: '',
            },
        });

    const { mutate, isLoading } = useMutation<
        AxiosResponse,
        AxiosError,
        Variables
    >('create', {
        onSuccess({ data }) {
            setAlertNotification(data);
        },
        onError({ response }) {
            const emailError = response?.data.errors.email;
            const message = response?.data.message;

            if (response?.status === 422) {
                if (alertNotification) {
                    setAlertNotification(null);
                }

                if (emailError) {
                    setError('email', {
                        type: 'manual',
                        message: emailError[0],
                    });
                } else {
                    clearErrors('email');
                }
            } else {
                clearErrors();
                setAlertNotification({
                    status: response?.status as number,
                    message,
                });
            }
        },
    });

    async function submit(event: FormEvent) {
        event.preventDefault();

        mutate({
            url: '/forgot-password',
            data: getValues(),
        });
    }

    return (
        <main className='max-w-[360px] bg-primary-light rounded mx-auto mt-[40px]'>
            <div className='bg-skin-main p-lg'>
                <div className='flex items-center justify-center'>
                    <a href='/' className='no-underline'>
                        <Logo />
                    </a>
                </div>

                <h1 className='text-md text-skin-secondary font-bold text-center mt-xs'>
                    Forgot password
                </h1>

                {alertNotification && (
                    <div
                        className={clsx(
                            'border rounded p-sm mt-sm',
                            alertNotification.status === 200
                                ? 'bg-success-transparent text-success border-success-transparent'
                                : 'bg-danger-transparent text-danger border-danger-transparent',
                        )}
                    >
                        <p className='text-md m-0'>
                            {alertNotification.message}
                        </p>
                    </div>
                )}

                <form className='mt-sm' onSubmit={submit}>
                    <InputField
                        id='email'
                        type='email'
                        label='Email address'
                        error={formState.errors.email?.message}
                        disabled={isLoading}
                        {...register('email')}
                    />

                    <button
                        type='submit'
                        className='button button-primary w-full rounded-full py-sm mt-lg'
                        disabled={isLoading}
                    >
                        Send password reset request
                    </button>
                </form>
            </div>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const props = {
        title: 'Forgot password',
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
