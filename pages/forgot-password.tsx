import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import InputField from 'components/utilities/InputField';
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
        <div className='py-md'>
            <main className='max-w-[420px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                {alertNotification && (
                    <div
                        className={clsx(
                            'border rounded-md p-sm',
                            alertNotification.status === 200
                                ? 'bg-primary-lighter text-primary border-primary-lighter'
                                : 'bg-danger-lighter text-danger border-danger-lighter',
                        )}
                    >
                        <p className='text-md m-0'>
                            {alertNotification.message}
                        </p>
                    </div>
                )}

                <form onSubmit={submit}>
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
                        className='button button-primary w-full py-sm mt-lg'
                        disabled={isLoading}
                    >
                        Send password reset request
                    </button>
                </form>
            </main>
        </div>
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
