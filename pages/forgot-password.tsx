import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import InputField from 'components/utilities/InputField';
import Radio from 'components/utilities/Radio';
import { axiosServer } from 'config/axios';

interface AlertNotification {
    status: number;
    message: string;
}

interface FieldValues {
    email: string;
    method: 'email' | 'sms';
}

interface Variables {
    url: string;
    data: FieldValues;
}

export default function ForgotPassword() {
    const [alertNotification, setAlertNotification] =
        useState<AlertNotification | null>(null);

    const { register, watch, getValues, setError, clearErrors, formState } =
        useForm<FieldValues>({
            defaultValues: {
                email: '',
                method: 'email',
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
            const message = response?.data.message;
            const errors = response?.data.errors;

            if (response?.status === 422) {
                const keys: ['email', 'method'] = ['email', 'method'];

                if (alertNotification) {
                    setAlertNotification(null);
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
                setAlertNotification({
                    status: response?.status as number,
                    message,
                });
            }
        },
    });

    const method = watch('method');

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
                        label='Email address or phone number'
                        error={formState.errors.email?.message}
                        disabled={isLoading}
                        {...register('email')}
                    />

                    <section className='mt-lg'>
                        <span className='block text-skin-text text-md font-bold'>
                            Verification method
                        </span>

                        <div className='flex items-center mt-xs'>
                            <Radio
                                containerClassName='flex items-center cursor-pointer'
                                id='email_verification'
                                label='Email'
                                value='email'
                                checked={method === 'email'}
                                disabled={isLoading}
                                {...register('method')}
                            />

                            <Radio
                                containerClassName='flex items-center cursor-pointer ml-xl'
                                id='sms_verification'
                                label='SMS'
                                value='sms'
                                checked={method === 'sms'}
                                disabled={isLoading}
                                {...register('method')}
                            />
                        </div>

                        {!!formState.errors.method && (
                            <p className='text-danger text-sm mt-xs mb-0'>
                                {formState.errors.method.message}
                            </p>
                        )}
                    </section>

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
