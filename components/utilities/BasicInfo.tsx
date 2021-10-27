import { HTMLProps } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import clsx from 'clsx';

interface Props extends HTMLProps<HTMLDivElement> {
    imageUrl: string | null;
    imageSize?: number;
    gender: 'Male' | 'Female';
    name: string;
    username: string;
}

function BasicInfo({
    className, name, username, gender, imageUrl, imageSize, ...props
}: Props) {
    return (
        <figure
            className={clsx('flex items-center', className)}
            {...props}
        >
            <MdAccountCircle className="text-skin-text-light" size={imageSize} />

            <figcaption className="ml-sm">
                <span className="block text-skin-text font-bold text-xs">{name}</span>
                <span className="block text-skin-text-light text-xs">{username}</span>
            </figcaption>
        </figure>
    );
}

BasicInfo.defaultProps = {
    imageSize: 40,
};

export default BasicInfo;
