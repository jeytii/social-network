import { HTMLAttributes } from 'react';
import BasicInfo from 'components/utilities/BasicInfo';
import {
    MdMoreHoriz,
    MdOutlineThumbUp,
    MdOutlineChatBubbleOutline,
    MdBookmarkBorder,
} from 'react-icons/md';
import clsx from 'clsx';

type Props = HTMLAttributes<HTMLElement>

export default function Post({ className, ...props }: Props) {
    return (
        <article className={clsx('bg-skin-bg-contrast rounded-md', className)} {...props}>
            <section className="p-md">
                <div className="flex items-center">
                    <BasicInfo imageUrl="/" imageSize={50} gender="Male" name="John doe" username="john.doe" />
                    <MdMoreHoriz className="text-skin-text-light text-lg ml-auto" />
                </div>

                <p className="paragraph-sm text-skin-text my-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae pariatur obcaecati recusandae tempore reprehenderit officia aut culpa deleniti ducimus, blanditiis aliquam consequuntur ipsam ullam! Possimus fugit veniam ipsam voluptas id! Lorem ipsum dolor sit amet consectetur adipisicing elitee.</p>

                <span className="text-skin-text-light text-xs">5 hours ago</span>
            </section>

            <section className="flex bg-skin-bg-contrast-light">
                <button
                    className="flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-skin-text"
                    type="button"
                >
                    <MdOutlineThumbUp className="text-lg" />
                    <span className="text-sm ml-sm">5</span>
                </button>

                <button
                    className="flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-skin-text"
                    type="button"
                >
                    <MdOutlineChatBubbleOutline className="text-lg" />
                    <span className="text-sm ml-sm">5</span>
                </button>

                <button
                    className="flex-1 flex items-center justify-center text-skin-text-light text-center py-sm hover:text-skin-text"
                    type="button"
                >
                    <MdBookmarkBorder className="text-lg" />
                </button>
            </section>
        </article>
    );
}
