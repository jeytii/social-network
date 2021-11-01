import { HTMLAttributes } from 'react';
import BasicInfo from 'components/utilities/BasicInfo';
import {
    MdMoreHoriz,
    MdOutlineThumbUp,
    MdOutlineChatBubbleOutline,
    MdBookmarkBorder,
} from 'react-icons/md';
import clsx from 'clsx';

type Props = HTMLAttributes<HTMLElement>;

export default function Post({ className, ...props }: Props) {
    return (
        <article
            className={clsx('bg-skin-bg-contrast rounded-md', className)}
            {...props}
        >
            <section className='p-md'>
                <div className='flex items-center'>
                    <BasicInfo
                        imageUrl='/'
                        imageSize={50}
                        gender='Male'
                        name='John doe'
                        username='@john.doe'
                    />

                    <button
                        type='button'
                        className='rounded-full p-xs ml-auto hover:bg-skin-bg-contrast-light'
                    >
                        <MdMoreHoriz className='text-skin-text-light text-lg' />
                    </button>
                </div>

                <p className='paragraph-md text-skin-text my-sm clamp'>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                    Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                    natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                    eu, pretium quis, sem. Nulla consequat massa quis enim.
                    Donec pede justo, fringilla vel, aliquet nec, vulputate
                    eget, arcu. In enim justo, rhoncus ut, imperdiet a,
                    venenatis vitae, justo. Nullam dictum felis eu pede mollis
                    pretium. Integer tincidunt. Cras dapibu
                </p>

                <span className='text-skin-text-light text-sm'>
                    5 hours ago
                </span>
            </section>

            <section className='flex bg-skin-bg-contrast-light'>
                <button
                    className='flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-primary'
                    type='button'
                >
                    <MdOutlineThumbUp className='text-lg' />
                    <span className='text-sm ml-sm'>5</span>
                </button>

                <button
                    className='flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-skin-text'
                    type='button'
                >
                    <MdOutlineChatBubbleOutline className='text-lg' />
                    <span className='text-sm ml-sm'>5</span>
                </button>

                <button
                    className='flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-skin-text'
                    type='button'
                >
                    <MdBookmarkBorder className='text-lg' />
                </button>
            </section>
        </article>
    );
}
