import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import InputField from 'components/utilities/InputField';
import Logo from 'components/Logo';
import { axiosClient, axiosServer } from 'config/axios';

interface Variables {
    url: string;
    data: {
        code: string;
    };
}

export default function Verification() {
    const [alertError, setAlertError] = useState<string | null>(null);
    const { register, getValues, setError, formState } = useForm({
        defaultValues: {
            code: '',
        },
    });

    const { mutate, isLoading } = useMutation<
        AxiosResponse,
        AxiosError,
        Variables
    >('update', {
        onSuccess({ data }) {
            Cookies.set('token', data.token);
            window.location.href = '/home';
        },
        onError(error) {
            const status = error.response?.status;
            const data = error.response?.data;

            if (status === 422) {
                if (alertError) {
                    setAlertError(null);
                }

                setError('code', {
                    type: 'manual',
                    message: data.errors.code[0],
                });
            } else {
                setAlertError(data.message);
            }
        },
    });

    async function submit(event: FormEvent) {
        event.preventDefault();

        mutate({
            url: '/verify',
            data: getValues(),
        });
    }

    return (
        <main className='max-w-[360px] bg-skin-main border border-skin-main rounded p-lg mx-auto mt-[40px]'>
            <div className='flex items-center justify-center'>
                <a href='/' className='no-underline'>
                    <Logo />
                </a>
            </div>

            <h1 className='text-md text-skin-secondary font-bold text-center mt-xs'>
                Verify your account
            </h1>

            <form className='mt-sm' onSubmit={submit}>
                <InputField
                    id='code'
                    type='number'
                    label='6-digit verification code'
                    error={formState.errors.code?.message}
                    disabled={isLoading}
                    {...register('code', {
                        valueAsNumber: true,
                    })}
                />
                <button
                    type='submit'
                    className='button button-primary w-full rounded-full py-sm mt-lg'
                    disabled={isLoading}
                >
                    Verify my account
                </button>
            </form>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    params,
    req,
}) => {
    if (!req.cookies || !req.cookies.token) {
        try {
            await axiosClient().get(`/verify/${params?.token}`);

            return {
                props: {
                    title: 'Verify account',
                    isPrivate: false,
                },
            };
        } catch (err) {
            return {
                notFound: true,
            };
        }
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
        try {
            await axiosClient().get(`/verify/${params?.token}`);

            return {
                props: {
                    title: 'Verify account',
                    isPrivate: false,
                },
            };
        } catch (err) {
            return {
                notFound: true,
            };
        }
    }
};
