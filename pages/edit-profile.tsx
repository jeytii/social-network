import { GetServerSideProps } from 'next';
import { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import ImageUploader from 'components/layouts/profile/ImageUploader';
import InputField from 'components/utilities/InputField';
import authenticate from 'lib/auth';
import type { User } from 'types/user';

interface ImageVariables {
    url: string;
    data: FormData;
}

interface FormValues {
    name: string;
    birth_date: string;
    bio: string;
    image_url: string | null;
}

interface SubmitData {
    url: string;
    data: FormValues;
}

interface UserType extends User {
    birth_date: string;
    bio: string;
}

interface Props {
    user: UserType;
}

export default function EditProfile({
    user: { name, username, birth_date, bio, image_url },
}: Props) {
    const defaultValues = { name, birth_date, bio, image_url };
    const {
        register,
        watch,
        getValues,
        setValue,
        setError,
        clearErrors,
        formState,
    } = useForm<FormValues>({ defaultValues });

    const { mutate: upload, isLoading: uploadLoading } = useMutation<
        AxiosResponse,
        AxiosError,
        ImageVariables
    >('create', {
        onSuccess({ data }) {
            setValue('image_url', data.data);
            clearErrors('image_url');
        },
        onError(error) {
            if (error.response?.status === 422) {
                setError('image_url', {
                    type: 'manual',
                    message: error.response.data.errors.image[0],
                });
            }
        },
    });

    const {
        mutate: update,
        isLoading: submitLoading,
        isSuccess,
    } = useMutation<unknown, AxiosError, SubmitData>('update', {
        onSuccess() {
            window.location.href = `/${username}`;
        },
        onError(error) {
            const errors = error.response?.data.errors;
            const keys = Object.keys(defaultValues);

            keys.forEach(key => {
                if (errors[key]) {
                    setError(key as keyof FormValues, {
                        type: 'manual',
                        message: errors[key][0],
                    });
                } else {
                    clearErrors(key as keyof FormValues);
                }
            });
        },
    });

    const values = watch();
    const bioLength = values.bio ? values.bio.length : 0;
    const charactersLeft = 120 - bioLength;

    function onBioChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const { target } = event;

        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
    }

    function checkBioLength(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (charactersLeft > 0) {
            return true;
        }

        event.preventDefault();
    }

    function uploadProfilePhoto(event: ChangeEvent<HTMLInputElement>) {
        const formData = new FormData();

        if (event.target.files) {
            formData.append('image', event.target.files[0]);
        }

        upload({
            url: '/api/profile/upload/profile-photo',
            data: formData,
        });
    }

    function resetProfilePhoto() {
        setValue('image_url', image_url);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        update({
            url: '/api/profile/update',
            data: getValues(),
        });
    }

    return (
        <section className='p-lg sm:px-md'>
            <form className='max-w-[480px] m-auto' onSubmit={submit}>
                <ImageUploader
                    src={values.image_url}
                    initialSrc={image_url}
                    loading={uploadLoading}
                    hasError={!!formState.errors.image_url}
                    onChange={uploadProfilePhoto}
                    onReset={resetProfilePhoto}
                />

                <InputField
                    containerClassName='mt-md'
                    id='name'
                    label='Name'
                    aria-label='Name field'
                    error={formState.errors.name?.message}
                    autoFocus
                    {...register('name')}
                />

                <InputField
                    containerClassName='mt-md'
                    id='birthdate'
                    type='date'
                    label='Birth date'
                    aria-label='Birth date field'
                    error={formState.errors.birth_date?.message}
                    {...register('birth_date')}
                />

                <label className='block mt-md' htmlFor='bio'>
                    <span className='flex items-center'>
                        <span className='text-skin-primary text-md font-bold'>
                            Bio
                        </span>
                        <span className='text-primary text-md ml-auto'>
                            {charactersLeft}
                        </span>
                    </span>

                    <textarea
                        className='textfield resize-none overflow-y-hidden mt-xs'
                        id='bio'
                        rows={3}
                        onKeyPress={checkBioLength}
                        {...register('bio', {
                            onChange: onBioChange,
                        })}
                    />

                    {!!formState.errors.bio && (
                        <p className='text-danger text-sm mt-xs mb-0'>
                            {formState.errors.bio.message}
                        </p>
                    )}
                </label>

                <button
                    type='submit'
                    className='button button-primary w-full rounded-full py-sm mt-lg'
                    disabled={submitLoading || isSuccess}
                >
                    Update my profile
                </button>
            </form>
        </section>
    );
}

export const getServerSideProps: GetServerSideProps = props =>
    authenticate('auth', props, {
        title: 'Edit profile',
    });
