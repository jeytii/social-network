import Link from 'next/link';
import {
    MdAccountCircle,
    MdOutlineCake,
    MdCalendarToday,
} from 'react-icons/md';
import TextLink from 'components/utilities/TextLink';
import FollowButton from 'components/utilities/FollowButton';

interface ProfileInfo {
    slug: string;
    name: string;
    username: string;
    birth_date: string;
    created_at: string;
    bio: string;
    image_url: string | null;
    followers_count: number;
    following_count: number;
    is_self: boolean;
    is_followed: boolean;
}

export default function ProfileHeadline({
    slug,
    name,
    username,
    birth_date,
    created_at,
    bio,
    image_url,
    followers_count,
    following_count,
    is_self,
    is_followed,
}: ProfileInfo) {
    return (
        <div className='p-lg sm:px-md'>
            <section className='flex items-center sm:block sm:text-center'>
                <figure className='flex items-center sm:block'>
                    <MdAccountCircle
                        className='text-skin-text-light m-auto'
                        size={80}
                        viewBox='2 2 20 20'
                    />

                    <figcaption className='ml-sm sm:mt-sm sm:mx-[0]'>
                        <span className='block text-skin-text font-bold text-md'>
                            {name}
                        </span>
                        <span className='block text-skin-text-light text-md'>
                            @{username}
                        </span>
                    </figcaption>
                </figure>

                {is_self ? (
                    <div className='ml-auto sm:mt-sm'>
                        <Link href='/edit-profile'>
                            <span className='button button-primary-outlined text-sm rounded-full'>
                                Edit profile
                            </span>
                        </Link>
                    </div>
                ) : (
                    <FollowButton userSlug={slug} condition={is_followed} />
                )}
            </section>

            {!!bio && (
                <p className='paragraph-md text-skin-text mt-lg sm:paragraph-sm'>
                    {bio}
                </p>
            )}

            <div className='flex items-center mt-lg xs:block sm:justify-center'>
                <div className='flex items-center sm:justify-center'>
                    <MdOutlineCake className='text-lg text-skin-text-light sm:text-md' />
                    <span className='text-md text-skin-text-light ml-xs'>
                        {birth_date}
                    </span>
                </div>

                <div className='flex items-center ml-xl sm:justify-center xs:ml-auto xs:mt-sm'>
                    <MdCalendarToday className='text-lg text-skin-text-light sm:text-md' />
                    <span className='text-md text-skin-text-light ml-xs'>
                        {created_at}
                    </span>
                </div>
            </div>

            <div className='flex items-center mt-lg sm:justify-center'>
                <TextLink className='text-md' href='/followers'>
                    <b className='text-skin-text font-bold'>
                        {followers_count}
                    </b>
                    <span className='text-skin-text-light ml-xs'>
                        Followers
                    </span>
                </TextLink>

                <TextLink className='text-md ml-xl' href='/following'>
                    <b className='text-skin-text font-bold'>
                        {following_count}
                    </b>
                    <span className='text-skin-text-light ml-xs'>
                        Following
                    </span>
                </TextLink>
            </div>
        </div>
    );
}
