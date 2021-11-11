import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import InputField from 'components/utilities/InputField';
import Radio from 'components/utilities/Radio';
import axios from 'config/axios';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

interface FormDataError {
    name: string[];
    email: string[];
    username: string[];
    phone_number: string[];
    password: string[];
    password_confirmation: string[];
    birth_date: string[];
    gender: string[];
    method: string[];
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
    const [loading, setLoading] = useState<boolean>(false);
    const { push } = useRouter();
    const {
        register,
        watch,
        getValues,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: fields,
    });

    const [gender, method] = watch(['gender', 'method']);

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            const { data } = await axios().post('/register', getValues());

            push(data.url);
        } catch (error: AxiosError) {
            const e = error.response?.data.errors;
            const keys = Object.keys(fields);

            keys.forEach(key => {
                if (e[key]) {
                    setError(key as keyof FormDataError, {
                        type: 'manual',
                        message: e[key][0],
                    });
                } else {
                    clearErrors(key as keyof FormDataError);
                }
            });

            setLoading(false);
        }
    }

    return (
        <div className='py-md'>
            <main className='max-w-[480px] m-auto rounded-md bg-skin-bg-contrast p-lg'>
                <h1 className='text-lg font-bold text-skin-text-light text-center'>
                    Create an account
                </h1>

                <form className='mt-lg' onSubmit={submit}>
                    <InputField
                        type='text'
                        label='Name'
                        error={errors.name?.message}
                        disabled={loading}
                        {...register('name')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='email'
                        label='Email address'
                        error={errors.email?.message}
                        disabled={loading}
                        {...register('email')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='text'
                        label='Username'
                        error={errors.username?.message}
                        disabled={loading}
                        {...register('username')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='tel'
                        label='Phone number'
                        placeholder='09123456789'
                        error={errors.phone_number?.message}
                        disabled={loading}
                        {...register('phone_number')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='password'
                        label='Password'
                        error={errors.password?.message}
                        disabled={loading}
                        {...register('password')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        type='password'
                        label='Confirm password'
                        error={errors.password_confirmation?.message}
                        disabled={loading}
                        {...register('password_confirmation')}
                    />

                    <InputField
                        containerClassName='mt-lg'
                        className='cursor-pointer'
                        type='date'
                        label='Birth date'
                        error={errors.birth_date?.message}
                        disabled={loading}
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
                                disabled={loading}
                                {...register('gender')}
                            />

                            <Radio
                                containerClassName='flex items-center cursor-pointer ml-xl'
                                id='female'
                                label='Female'
                                value='Female'
                                checked={gender === 'Female'}
                                disabled={loading}
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

                        {!!errors.method && (
                            <p className='text-danger text-sm mt-xs mb-0'>
                                {errors.method.message}
                            </p>
                        )}
                    </section>

                    <button
                        type='submit'
                        className='btn-primary w-full text-md mt-lg'
                        disabled={loading}
                    >
                        Sign up
                    </button>
                </form>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    if (!req.cookies || !req.cookies.token) {
        return {
            props: {
                title: 'Create an account - Sosyal.me',
                isPrivate: false,
            },
        };
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
        return {
            props: {
                title: 'Create an account - Sosyal.me',
                isPrivate: false,
            },
        };
    }
};
