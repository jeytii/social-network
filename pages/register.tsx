import Head from 'next/head';
import Logo from 'components/Logo';
import InputField from 'components/utilities/InputField';
import Select from 'components/utilities/Select';
import Radio from 'components/utilities/Radio';
import { useState } from 'react';

const days = [1, 2, 3];
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - (i + 1));
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Register() {
    const [gender, setGender] = useState<'Male' | 'Female' | null>(null);

    return (
        <section className="bg-skin-bg min-h-screen">
            <Head>
                <title>Create an account</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="flex align-middle justify-center py-lg">
                <Logo />
            </header>

            <div className="py-md sm:px-md">
                <main className="max-w-screen-sm min-w-max m-auto rounded-md bg-skin-bg-contrast p-lg">
                    <h1 className="text-lg font-bold text-skin-text-light text-center">Create an account</h1>

                    <form className="mt-lg">
                        <InputField
                            id="name"
                            type="text"
                            label="Name"
                        />

                        <InputField
                            containerClassName="mt-lg"
                            id="email"
                            type="email"
                            label="Email address"
                            placeholder="username@domain.com"
                        />

                        <InputField
                            containerClassName="mt-lg"
                            id="username"
                            type="text"
                            label="Username"
                        />

                        <InputField
                            containerClassName="mt-lg"
                            id="phone"
                            type="tel"
                            label="Phone number"
                            placeholder="09123456789"
                        />

                        <InputField
                            containerClassName="mt-lg"
                            id="password"
                            type="password"
                            label="Password"
                        />

                        <InputField
                            containerClassName="mt-lg"
                            id="password_confirmation"
                            type="password"
                            label="Confirm password"
                        />

                        <section className="mt-lg">
                            <span className="block text-skin-text font-bold text-md">
                                Birthdate
                            </span>

                            <div className="flex mt-xs">
                                <Select
                                    className="bg-skin-bg-contrast text-skin-text rounded-md p-sm cursor-pointer"
                                    placeholder="Month"
                                    items={months}
                                />
                                <input
                                    className="bg-skin-bg-contrast text-skin-text p-sm rounded-md ml-md"
                                    type="number"
                                    placeholder="Day"
                                    min="1"
                                    max="31"
                                    defaultValue="1"
                                />
                                <Select
                                    className="bg-skin-bg-contrast text-skin-text rounded-md p-sm cursor-pointer ml-md"
                                    placeholder="Year"
                                    items={years}
                                />
                            </div>
                        </section>

                        <section className="mt-lg">
                            <span className="block text-skin-text font-bold text-md">
                                Gender
                            </span>

                            <div className="flex items-center mt-xs">
                                <Radio
                                    containerClassName="flex items-center cursor-pointer"
                                    id="male"
                                    label="Male"
                                    name="gender"
                                    value="Male"
                                    checked={gender === 'Male'}
                                />

                                <Radio
                                    containerClassName="flex items-center cursor-pointer ml-lg"
                                    id="female"
                                    label="Female"
                                    name="gender"
                                    value="Female"
                                    checked={gender === 'Female'}
                                />
                            </div>
                        </section>

                        <button type="button" className="btn-primary mt-lg w-full" disabled>Sign up</button>
                    </form>
                </main>
            </div>
        </section>
    );
}
