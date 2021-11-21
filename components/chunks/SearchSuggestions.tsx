import Link from 'next/link';
import clsx from 'clsx';
import BasicInfo from 'components/utilities/BasicInfo';
import { User } from 'types/user';
import { MutableRefObject, useEffect } from 'react';

interface Props {
    data: User[];
    target: MutableRefObject<HTMLElement | null>;
    hideEvent(): void;
}

export default function SearchSuggestions({ data, target, hideEvent }: Props) {
    function outsideClick(event: MouseEvent) {
        if (event.target === target.current) {
            return;
        }

        hideEvent();
    }

    useEffect(() => {
        window.addEventListener('click', outsideClick);

        return () => {
            window.removeEventListener('click', outsideClick);
        };
    }, []);

    return (
        <div className='absolute top-[100%] left-[0px] w-full bg-skin-bg shadow-md rounded-b-2xl z-20'>
            {data.map(({ slug, ...user }, index) => (
                <Link key={slug} href={`/${user.username}`} passHref>
                    <BasicInfo
                        className={clsx(
                            'bg-skin-bg-contrast-light p-sm cursor-pointer hover:bg-skin-bg-contrast',
                            index === data.length - 1 && 'rounded-b-2xl',
                        )}
                        imageSize={40}
                        {...user}
                    />
                </Link>
            ))}
        </div>
    );
}
