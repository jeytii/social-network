import { useState } from 'react';
import Public from 'components/Public';
import InputField from 'components/utilities/InputField';
import Select from 'components/utilities/Select';
import Radio from 'components/utilities/Radio';

interface MonthOption {
    label: string;
    value: string;
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const years = Array.from({ length: 100 }, (_, i) => {
    const item = new Date().getFullYear() - (i + 1);

    return {
        label: `${item}`,
        value: item,
    };
});

const generateMonths = () => {
    const items: MonthOption[] = [];

    months.forEach((month) => {
        items.push({
            label: month,
            value: month,
        });
    });

    return items;
};

export default function Register() {
    const [gender, setGender] = useState<'Male' | 'Female' | null>(null);
    const [method, setMethod] = useState<0 | 1>(0);

    return (
        <Public title="Create an account - Sosyal.me">
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
                                    items={generateMonths()}
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

                        <section className="mt-lg">
                            <span className="block text-skin-text font-bold text-md">
                                Verification method
                            </span>

                            <div className="flex items-center mt-xs">
                                <Radio
                                    containerClassName="flex items-center cursor-pointer"
                                    id="email_verification"
                                    label="Email"
                                    name="method"
                                    value={0}
                                    checked={method === 0}
                                />

                                <Radio
                                    containerClassName="flex items-center cursor-pointer ml-lg"
                                    id="sms_verification"
                                    label="SMS"
                                    name="method"
                                    value={1}
                                    checked={method === 1}
                                />
                            </div>
                        </section>

                        <button type="button" className="btn-primary mt-lg w-full" disabled>Sign up</button>
                    </form>
                </main>
            </div>
        </Public>
    );
}
