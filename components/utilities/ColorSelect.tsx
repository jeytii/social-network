import { MdCheck, MdKeyboardArrowDown } from 'react-icons/md';
import { Listbox } from '@headlessui/react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface Color {
    key: string | number;
    name: string;
    r: number;
    g: number;
    b: number;
}

const colors = [
    { key: '0', name: 'Blue', hex: '#21a1e1', r: 56, g: 147, b: 193 },
    { key: '1', name: 'Purple', hex: '#800080', r: 128, g: 0, b: 128 },
    { key: '2', name: 'Green', hex: '#2e8b57', r: 46, g: 139, b: 87 },
    { key: '3', name: 'Magenta', hex: '#ff00ff', r: 255, g: 0, b: 255 },
    { key: '4', name: 'Goldenrod', hex: '#daa520', r: 218, g: 165, b: 32 },
];

export default function ColorSelect() {
    const [color, setColor] = useState<Color>(colors[0]);

    useEffect(() => {
        const root = document.documentElement;
        const { r, g, b } = color;

        root.style.setProperty(
            '--primary-default',
            `rgba(${r}, ${g}, ${b}, 0.8)`,
        );

        root.style.setProperty('--primary-dark', `rgb(${r}, ${g}, ${b})`);

        root.style.setProperty(
            '--primary-light',
            `rgba(${r}, ${g}, ${b}, 0.6)`,
        );

        root.style.setProperty(
            '--primary-transparent',
            `rgba(${r}, ${g}, ${b}, 0.2)`,
        );
    }, [color]);

    return (
        <section className='flex items-center bg-skin-main rounded p-md mt-sm'>
            <h3 className='block text-md text-skin-secondary font-bold'>
                Accent color
            </h3>

            <Listbox value={color} onChange={setColor}>
                <div className='relative ml-auto'>
                    <Listbox.Button className='relative py-xs px-md w-[140px] text-left bg-primary-transparent border border-primary-transparent rounded-full cursor-pointer'>
                        <span className='text-md text-skin-primary'>
                            {color.name}
                        </span>

                        <span className='absolute inset-y-[0px] right-[10px] flex items-center pr-2 pointer-events-none'>
                            <MdKeyboardArrowDown
                                className='text-lg text-skin-secondary'
                                aria-hidden='true'
                            />
                        </span>
                    </Listbox.Button>

                    <Listbox.Options className='absolute right-[0px] top-[100%]  w-full mt-xs overflow-auto bg-skin-white rounded ring-1 ring-black ring-opacity-5 z-10 sm:text-sm'>
                        {colors.map(c => (
                            <Listbox.Option key={c.key} value={c}>
                                {({ selected }) => (
                                    <div className='flex items-center p-sm cursor-pointer hover:bg-primary-transparent'>
                                        <span
                                            className='inline-block w-[10px] h-[10px] rounded-full'
                                            style={{ background: c.hex }}
                                        />

                                        <span className='text-md ml-xs'>
                                            {c.name}
                                        </span>

                                        {selected && (
                                            <MdCheck className='text-success ml-auto' />
                                        )}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </section>
    );
}
