import Link from 'next/link';
import { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
    href: string;
    children: ReactNode;
}

export default function TextLink({ href, children, ...props }: Props) {
    return (
        <div {...props}>
            <Link href={href}>
                <span className="block text-sm cursor-pointer">
                    {children}
                </span>
            </Link>
        </div>
    );
}
