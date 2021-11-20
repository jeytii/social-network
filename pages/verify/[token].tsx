import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import InputField from 'components/utilities/InputField';
import axios from 'config/axios';

export default function Verification() {
    const [alertError, setAlertError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { push } = useRouter();
    const { register, watch, getValues, setError, formState } = useForm({
        defaultValues: {
            code: '',
        },
    });

    const code = watch('code');

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            const { data } = await axios().put('/verify', getValues());

            Cookies.set('user', JSON.stringify(data.user));
            Cookies.set('token', data.token);

            push('/home');
        } catch (error) {
            const { status, data } = error.response;

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

            setLoading(false);
        }
    }

    return (
        <div className='py-md'>
            <main className='max-w-[480px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                <h1 className='text-lg font-bold text-skin-text-light text-center'>
                    Verify your account
                </h1>

                <form className='mt-lg' onSubmit={submit}>
                    <InputField
                        id='code'
                        type='number'
                        label='6-digit verification code'
                        error={formState.errors.code?.message}
                        disabled={loading}
                        {...register('code', {
                            valueAsNumber: true,
                        })}
                    />
                    <button
                        type='submit'
                        className='button button-primary w-full py-sm mt-lg'
                        disabled={Number.isNaN(code) || code === '' || loading}
                    >
                        Verify my account
                    </button>
                </form>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    params,
    req,
}) => {
    if (!req.cookies || !req.cookies.token) {
        try {
            await axios().get(`/verify/${params?.token}`);

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
        await axios(req.cookies.token).get(`${process.env.APP_URL}/private`);

        return {
            redirect: {
                destination: '/home',
                permanent: false,
            },
        };
    } catch (e) {
        try {
            await axios().get(`/verify/${params?.token}`);

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
