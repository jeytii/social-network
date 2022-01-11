import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import {
    MdAccountCircle,
    MdOutlineCake,
    MdCalendarToday,
} from 'react-icons/md';
import FollowButton from 'components/utilities/FollowButton';

interface ProfileInfo {
    slug: string;
    name: string;
    username: string;
    birth_date: string;
    created_at: string;
    bio: string;
    image_url: string | null;
    is_self: boolean;
    is_followed: boolean;
}

function ProfileHeadline({
    slug,
    name,
    username,
    birth_date,
    created_at,
    bio,
    image_url,
    is_self,
    is_followed,
}: ProfileInfo) {
    return (
        <div className='bg-skin-main border border-skin-main rounded p-lg'>
            <section className='flex items-center sm:block sm:text-center'>
                <figure className='flex items-center sm:block'>
                    {image_url ? (
                        <Image
                            className='m-auto'
                            src={image_url}
                            width={80}
                            height={80}
                        />
                    ) : (
                        <MdAccountCircle
                            className='text-skin-secondary m-auto'
                            size={80}
                            viewBox='2 2 20 20'
                        />
                    )}

                    <figcaption className='ml-sm sm:mt-sm sm:mx-[0]'>
                        <span className='block text-skin-primary font-bold text-md'>
                            {name}
                        </span>
                        <span className='block text-skin-secondary text-md'>
                            {username}
                        </span>
                    </figcaption>
                </figure>

                {is_self ? (
                    <div className='ml-auto sm:mt-sm'>
                        <Link href='/edit-profile'>
                            <span className='button button-primary-outlined text-sm rounded-full'>
                                Edit
                            </span>
                        </Link>
                    </div>
                ) : (
                    <FollowButton userSlug={slug} condition={is_followed} />
                )}
            </section>

            <div className='flex items-center mt-sm sm:justify-center'>
                <MdOutlineCake
                    className='text-md text-skin-secondary'
                    viewBox='2 2 20 20'
                />
                <span className='text-md text-skin-secondary ml-sm'>
                    {birth_date}
                </span>
            </div>

            <div className='flex items-center mt-sm sm:justify-center xs:ml-auto'>
                <MdCalendarToday
                    className='text-md text-skin-secondary'
                    viewBox='2 2 20 20'
                />
                <span className='text-md text-skin-secondary ml-sm'>
                    Joined on {created_at}
                </span>
            </div>

            {!!bio && (
                <p className='paragraph-md italic text-skin-secondary mt-sm sm:text-center'>
                    {bio}
                </p>
            )}
        </div>
    );
}

export default memo(ProfileHeadline);
