import {
    MdAccountCircle,
    MdOutlineCake,
    MdCalendarToday,
} from 'react-icons/md';
import TextLink from 'components/utilities/TextLink';

export default function ProfileHeadline() {
    return (
        <div className='p-lg sm:px-md'>
            <section className='flex items-center text-center sm:block'>
                <figure className='flex items-center sm:block'>
                    <MdAccountCircle
                        className='text-skin-text-light m-auto'
                        size={90}
                        viewBox='2 2 20 20'
                    />

                    <figcaption className='ml-sm sm:mt-sm sm:mx-[0]'>
                        <span className='block text-skin-text font-bold text-md'>
                            John Doe
                        </span>
                        <span className='block text-skin-text-light text-md'>
                            @john.doe
                        </span>
                    </figcaption>
                </figure>

                <TextLink className='ml-auto sm:mt-sm' href='/edit-profile'>
                    <span className='btn-primary-outline text-sm py-xs px-md'>
                        Edit profile
                    </span>
                </TextLink>
            </section>

            <p className='paragraph-md text-skin-text mt-lg sm:paragraph-sm'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. At nisl
                cursus a pulvinar ullamcorper purus amet, adipiscing. At nisl
                cursus a pulvinar ul.
            </p>

            <div className='flex items-center mt-lg'>
                <div className='flex items-center'>
                    <MdOutlineCake className='text-lg text-skin-text-light sm:text-md' />
                    <span className='text-md text-skin-text-light ml-xs sm:text-sm'>
                        September 18, 1995
                    </span>
                </div>

                <div className='flex items-center ml-xl'>
                    <MdCalendarToday className='text-lg text-skin-text-light sm:text-md' />
                    <span className='text-md text-skin-text-light ml-xs sm:text-sm'>
                        September 2020
                    </span>
                </div>
            </div>

            <div className='flex items-center mt-lg'>
                <TextLink className='text-md sm:text-sm' href='/followers'>
                    <b className='text-skin-text font-bold'>10</b>
                    <span className='text-skin-text-light ml-xs'>
                        Followers
                    </span>
                </TextLink>

                <TextLink
                    className='text-md ml-xl sm:text-sm'
                    href='/following'
                >
                    <b className='text-skin-text font-bold'>20</b>
                    <span className='text-skin-text-light ml-xs'>
                        Following
                    </span>
                </TextLink>
            </div>
        </div>
    );
}
