import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import InputField from 'components/utilities/InputField';
import authenticate from 'lib/auth';
import type { User } from 'types/user';

interface Variables {
    url: string;
    data: {
        username: string;
        password: string;
    };
}

export default function ChangeUsername({ user }: { user: User }) {
    const [errorAlert, setErrorAlert] = useState<string | null>(null);
    const { mutate, isLoading } = useMutation<unknown, AxiosError, Variables>(
        'update',
        { onSuccess, onError },
    );
    const { register, getValues, watch, setError, clearErrors, formState } =
        useForm({
            defaultValues: { username: user.username, password: '' },
        });

    const [userName, password] = watch(['username', 'password']);

    function onError(error: AxiosError) {
        if (error.response?.status === 422) {
            const { errors } = error.response.data;
            const keys: ['username', 'password'] = ['username', 'password'];

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
            url: '/api/settings/change/username',
            data: getValues(),
        });
    }

    return (
        <section className='max-w-[480px] m-auto p-lg'>
            {errorAlert && errorAlert.length && (
                <p className='bg-danger-light text-md text-danger rounded p-sm mb-lg'>
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
                    className='button button-primary w-full rounded-full py-sm mt-lg'
                    type='submit'
                    disabled={
                        isLoading ||
                        !userName.length ||
                        !password.length ||
                        (!!userName.length && userName === user.username)
                    }
                >
                    Update my username
                </button>
            </form>
        </section>
    );
}

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('auth', props, {
        title: 'Change username',
    });
