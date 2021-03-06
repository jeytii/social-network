import { GetServerSideProps } from 'next';
import { useState, FormEvent } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import InputField from 'components/utilities/InputField';
import Radio from 'components/utilities/Radio';
import Logo from 'components/utilities/Logo';
import authenticate from 'lib/auth';

interface RequestBody {
    name: string;
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
    birth_date: string;
    gender: 'Male' | 'Female' | null;
}

interface Variables {
    url: string;
    data: RequestBody;
}

const fields = {
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    birth_date: '',
    gender: null,
};

export default function Register() {
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
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

    const { mutate, isLoading } = useMutation<
        AxiosResponse,
        AxiosError,
        Variables
    >('create', {
        onSuccess() {
            setIsSuccessful(true);
            window.scrollTo(0, 0);
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

    const { gender } = watch();

    async function submit(event: FormEvent) {
        event.preventDefault();

        mutate({
            url: '/register',
            data: getValues(),
        });
    }

    return (
        <div className='py-lg'>
            <main className='max-w-[360px] bg-skin-main border border-skin-main rounded p-lg m-auto'>
                <div className='flex items-center justify-center'>
                    <a href='/' className='no-underline'>
                        <Logo />
                    </a>
                </div>

                <h1 className='text-md text-skin-secondary font-bold text-center mt-xs'>
                    Register an account
                </h1>

                {isSuccessful && (
                    <p className='bg-success-transparent paragraph-sm text-success-dark p-sm border border-success rounded mt-lg'>
                        Registration successful. Please check for the
                        verification code that was sent to your email address.
                    </p>
                )}

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
                        <span className='block text-skin-primary text-md font-bold'>
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

                    <button
                        type='submit'
                        className='button button-primary w-full rounded-full py-sm mt-lg'
                        disabled={isLoading}
                    >
                        Create account
                    </button>
                </form>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('guest', props, {
        title: 'Create an account',
    });
