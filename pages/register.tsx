import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import InputField from 'components/utilities/InputField';
import Radio from 'components/utilities/Radio';
import { axiosServer } from 'config/axios';

interface RequestBody {
    name: string;
    email: string;
    username: string;
    phone_number: string;
    password: string;
    password_confirmation: string;
    birth_date: string;
    gender: 'Male' | 'Female' | null;
    method: string | null;
}

interface Variables {
    url: string;
    data: RequestBody;
}

const fields = {
    name: '',
    email: '',
    username: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
    birth_date: '',
    gender: null,
    method: null,
};

export default function Register() {
    const { push } = useRouter();
    const {
        register,
        watch,
        getValues,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<RequestBody>({
        defaultValues: fields,
    });

    const { mutate, isLoading } = useMutation<
        AxiosResponse,
        AxiosError,
        Variables
    >('create', {
        onSuccess({ data }) {
            push(data.url);
        },
        onError(error) {
            const e = error.response?.data.errors;
            const keys = Object.keys(fields);

            keys.forEach(key => {
                if (e[key]) {
                    setError(key as keyof RequestBody, {
                        type: 'manual',
                        message: e[key][0],
                    });
                } else {
                    clearErrors(key as keyof RequestBody);
                }
            });
        },
    });

    const [gender, method] = watch(['gender', 'method']);

    async function submit(event: FormEvent) {
        event.preventDefault();

        mutate({
            url: '/register',
            data: getValues(),
        });
    }

    return (
        <div className='py-md'>
            <main className='max-w-[420px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                <h1 className='text-lg text-skin-text-light text-center'>
                    Create an account
                </h1>

                <form className='mt-sm' onSubmit={submit}>
                    <InputField
                        type='text'
                        label='Name'
                        error={errors.name?.message}
                        disabled={isLoading}
                        {...register('name')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='email'
                        label='Email address'
                        placeholder='sample@domain.com'
                        error={errors.email?.message}
                        disabled={isLoading}
                        {...register('email')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='text'
                        label='Username'
                        error={errors.username?.message}
                        disabled={isLoading}
                        {...register('username')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='tel'
                        label='Phone number'
                        placeholder='09123456789'
                        error={errors.phone_number?.message}
                        disabled={isLoading}
                        {...register('phone_number')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='password'
                        label='Password'
                        error={errors.password?.message}
                        disabled={isLoading}
                        {...register('password')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='password'
                        label='Confirm password'
                        error={errors.password_confirmation?.message}
                        disabled={isLoading}
                        {...register('password_confirmation')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        className='cursor-pointer'
                        type='date'
                        label='Birth date'
                        error={errors.birth_date?.message}
                        disabled={isLoading}
                        {...register('birth_date')}
                    />

                    <section className='mt-lg'>
                        <span className='block text-skin-text text-md font-bold'>
                            Gender
                        </span>

                        <div className='flex items-center mt-xs'>
                            <Radio
                                containerClassName='flex items-center cursor-pointer'
                                id='male'
                                label='Male'
                                value='Male'
                                checked={gender === 'Male'}
                                disabled={isLoading}
                                {...register('gender')}
                            />

                            <Radio
                                containerClassName='flex items-center cursor-pointer ml-xl'
                                id='female'
                                label='Female'
                                value='Female'
                                checked={gender === 'Female'}
                                disabled={isLoading}
                                {...register('gender')}
                            />
                        </div>

                        {!!errors.gender && (
                            <p className='text-danger text-sm mt-xs mb-0'>
                                {errors.gender.message}
                            </p>
                        )}
                    </section>

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

                        {!!errors.method && (
                            <p className='text-danger text-sm mt-xs mb-0'>
                                {errors.method.message}
                            </p>
                        )}
                    </section>

                    <button
                        type='submit'
                        className='button button-primary w-full py-sm mt-lg'
                        disabled={isLoading}
                    >
                        Sign up
                    </button>
                </form>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const props = {
        title: 'Create an account',
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
