import { Switch } from '@headlessui/react';
import { memo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import clsx from 'clsx';
import type { User } from 'types/user';

interface Variables {
    url: string;
    data: {
        dark_mode: boolean;
    };
}

interface Props {
    className?: string;
    checked: boolean;
}

type UserType = User & {
    dark_mode: boolean;
};

function DarkModeToggler({ className, checked }: Props) {
    const queryClient = useQueryClient();
    const [darkMode, setDarkMode] = useState<boolean>(checked);

    const { mutate } = useMutation<unknown, unknown, Variables>('update', {
        onSuccess() {
            setDarkMode(current => !current);

            queryClient.setQueryData<UserType | undefined>('user', current => {
                if (current) {
                    return { ...current, dark_mode: !current?.dark_mode };
                }

                return current;
            });
        },
    });

    function toggleDarkMode() {
        mutate({
            url: '/api/settings/dark-mode',
            data: {
                dark_mode: !darkMode,
            },
        });
    }

    return (
        <div className={className}>
            <Switch
                checked={darkMode as boolean}
                onChange={toggleDarkMode}
                className={clsx(
                    'relative flex flex-shrink-0 h-[25px] w-[45px] rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75',
                    darkMode ? 'bg-primary-light' : 'bg-skin-secondary',
                )}
            >
                <span className='sr-only'>Toggle Dark Mode</span>
                <span
                    aria-hidden='true'
                    className={clsx(
                        'pointer-events-none inline-block h-[25px] w-[25px] rounded-full bg-skin-white border shadow-lg transform ring-0 transition ease-in-out duration-200',
                        darkMode
                            ? 'border-primary-light'
                            : 'border-skin-secondary',
                        darkMode ? 'translate-x-[20px]' : 'translate-x-[0px]',
                    )}
                />
            </Switch>
        </div>
    );
}

DarkModeToggler.defaultProps = {
    className: undefined,
};

export default memo(
    DarkModeToggler,
    (prev, current) => prev.checked === current.checked,
);
