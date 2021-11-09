import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import Public from 'components/Public';
import InputField from 'components/utilities/InputField';
import Radio from 'components/utilities/Radio';
import axios from 'config/axios';

interface AlertNotifcation {
    status: number;
    message: string;
}

interface ForgotPasswordFormDataError {
    email: string[];
    method: string[];
}

const fields = {
    email: '',
    method: 'email',
};

export default function ForgotPassword() {
    const [alertNotification, setAlertNotification] =
        useState<AlertNotifcation | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { register, watch, getValues, setError, clearErrors, formState } =
        useForm({
            defaultValues: fields,
        });

    const method = watch('method');

    function processFormErrors(error: AxiosError) {
        const { errors } = error.response?.data;
        const keys = Object.keys(fields);

        if (alertNotification) {
            setAlertNotification(null);
        }

        keys.forEach(key => {
            if (errors[key]) {
                setError(key as keyof ForgotPasswordFormDataError, {
                    type: 'manual',
                    message: errors[key][0],
                });
            } else {
                clearErrors(key as keyof ForgotPasswordFormDataError);
            }
        });
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            const { data } = await axios().post(
                '/forgot-password',
                getValues(),
            );

            setLoading(false);
            setAlertNotification(data);
        } catch (error: AxiosError) {
            const { status, data } = error.response;

            setLoading(false);

            if (status === 422) {
                processFormErrors(error);
            } else {
                clearErrors();
                setAlertNotification({
                    status,
                    message: data.message,
                });
            }
        }
    }

    return (
        <Public title='Forgot password - Sosyal.me'>
            <div className='py-md'>
                <main className='max-w-[480px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                    {!!alertNotification && (
                        <div
                            className={clsx(
                                'border rounded-md p-sm',
                                alertNotification.status === 200
                                    ? 'bg-primary-lighter text-primary border-primary'
                                    : 'bg-danger-lighter text-danger border-danger',
                            )}
                        >
                            <p className='text-md m-0'>
                                {/* After successfully making a request, you should
                                reset your password within <b>30 minutes</b>.
                                Otherwise, send another request. */}
                                {alertNotification.message}
                            </p>
                        </div>
                    )}

                    <form className='mt-lg' onSubmit={submit}>
                        <InputField
                            id='email'
                            type='email'
                            label='Email address'
                            error={formState.errors.email?.message}
                            disabled={loading}
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
                                    disabled={loading}
                                    {...register('method')}
                                />

                                <Radio
                                    containerClassName='flex items-center cursor-pointer ml-xl'
                                    id='sms_verification'
                                    label='SMS'
                                    value='sms'
                                    checked={method === 'sms'}
                                    disabled={loading}
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
                            className='btn-primary w-full text-md mt-lg'
                            disabled={loading}
                        >
                            Send request
                        </button>
                    </form>
                </main>
            </div>
        </Public>
    );
}
