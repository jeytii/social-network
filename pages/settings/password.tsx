import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import InputField from 'components/utilities/InputField';
import { axiosServer } from 'config/axios';

interface RequestBody {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

interface Variables {
    url: string;
    data: RequestBody;
}

const values = {
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
};

export default function ChangePassword() {
    const [errorAlert, setErrorAlert] = useState<string | null>(null);
    const { mutate, isLoading } = useMutation<unknown, AxiosError, Variables>(
        'update',
        { onSuccess, onError },
    );
    const { register, getValues, watch, setError, clearErrors, formState } =
        useForm({
            defaultValues: values,
        });

    const body = watch();
    const allBlank = Object.values(body).some(input => !input.length);

    function onError(error: AxiosError) {
        if (error.response?.status === 422) {
            const { errors } = error.response.data;
            const keys = Object.keys(values);

            if (errorAlert) {
                setErrorAlert(null);
            }

            keys.forEach(key => {
                if (errors[key]) {
                    setError(key as keyof RequestBody, {
                        type: 'manual',
                        message: errors[key][0],
                    });
                } else {
                    clearErrors(key as keyof RequestBody);
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
            url: '/api/settings/change/password',
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
                    id='current-password'
                    type='password'
                    label='Current password'
                    disabled={isLoading}
                    error={formState.errors.current_password?.message}
                    autoFocus
                    {...register('current_password')}
                />

                <InputField
                    containerClassName='mt-lg'
                    className='text-md'
                    id='new-password'
                    type='password'
                    label='New password'
                    disabled={isLoading}
                    error={formState.errors.new_password?.message}
                    {...register('new_password')}
                />

                <InputField
                    containerClassName='mt-lg'
                    className='text-md'
                    id='new-password-confirmation'
                    type='password'
                    label='Confirm new password'
                    disabled={isLoading}
                    error={formState.errors.new_password_confirmation?.message}
                    {...register('new_password_confirmation')}
                />

                <button
                    className='button button-primary w-full py-sm mt-lg'
                    type='submit'
                    disabled={isLoading || allBlank}
                >
                    Update my password
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
        await axiosServer(req.cookies.token).get('/private');

        return {
            props: {
                title: 'Change password',
                isPrivate: true,
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
