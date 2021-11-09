import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import {
    MdOutlineClear,
    MdOutlineEditNote,
    MdOutlineThumbUp,
} from 'react-icons/md';
import BasicInfo from 'components/utilities/BasicInfo';

type Props = HTMLAttributes<HTMLElement>;

export default function Comment({ className, ...props }: Props) {
    return (
        <article
            className={clsx('bg-skin-bg-contrast rounded-md p-md', className)}
            {...props}
        >
            <BasicInfo
                image_url='/'
                gender='Male'
                name='John doe'
                username='5 hours ago'
            />

            <p className='paragraph-md clamp text-skin-text my-sm'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Molestiae pariatur obcaecati recusandae tempore reprehenderit
                officia aut culpa deleniti ducimus, blanditiis aliquam
                consequuntur ipsam ullam! Possimus fugit veniam ipsam voluptas
                id! Lorem ipsum dolor sit amet consectetur adipisicing elitee.
            </p>

            <div className='flex items-center'>
                <button
                    className='flex items-center text-skin-text-light hover:text-primary'
                    type='button'
                >
                    <MdOutlineThumbUp className='text-lg' />
                    <span className='text-sm ml-xs'>5</span>
                </button>

                <button
                    className='flex items-center text-skin-text-light ml-xxl hover:text-skin-text'
                    type='button'
                >
                    <MdOutlineEditNote className='text-lg' />
                    <span className='text-sm ml-xs'>Edit</span>
                </button>

                <button
                    className='flex items-center text-skin-text-light ml-xxl hover:text-danger'
                    type='button'
                >
                    <MdOutlineClear className='text-lg' />
                    <span className='text-sm ml-xs'>Delete</span>
                </button>
            </div>
        </article>
    );
}
