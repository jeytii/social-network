import { Switch } from '@headlessui/react';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import clsx from 'clsx';
import type { User } from 'types/user';

type UserType = User & {
    dark_mode: boolean;
};

export default function DarkModeToggler({ className }: { className?: string }) {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<UserType>('user');
    const [checked, setChecked] = useState<boolean>(user?.dark_mode as boolean);

    function toggleDarkMode() {
        setChecked(current => !current);

        queryClient.setQueryData<UserType | undefined>('user', current => {
            if (current) {
                return { ...current, dark_mode: !current?.dark_mode };
            }

            return current;
        });
    }

    return (
        <div className={className}>
            <Switch
                checked={checked}
                onChange={toggleDarkMode}
                className={clsx(
                    'relative flex flex-shrink-0 h-[25px] w-[45px] rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75',
                    checked ? 'bg-primary-light' : 'bg-skin-secondary',
                )}
            >
                <span className='sr-only'>Toggle Dark Mode</span>
                <span
                    aria-hidden='true'
                    className={clsx(
                        'pointer-events-none inline-block h-[25px] w-[25px] rounded-full bg-skin-white border shadow-lg transform ring-0 transition ease-in-out duration-200',
                        checked
                            ? 'border-primary-light'
                            : 'border-skin-secondary',
                        checked ? 'translate-x-[20px]' : 'translate-x-[0px]',
                    )}
                />
            </Switch>
        </div>
    );
}

DarkModeToggler.defaultProps = {
    className: undefined,
};
