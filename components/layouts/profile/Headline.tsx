import {
    MdOutlineCake,
    MdCalendarToday,
    MdOutlineLocationOn,
} from 'react-icons/md';
import BasicInfo from 'components/utilities/BasicInfo';
import TextLink from 'components/utilities/TextLink';

export default function ProfileHeadline() {
    return (
        <div className='p-lg'>
            <section className='flex items-center'>
                <BasicInfo
                    name='John Doe'
                    username='@john.doe'
                    gender='Male'
                    imageUrl='/'
                    imageSize={100}
                />

                <TextLink className='ml-auto' href='/edit-profile'>
                    <span className='btn-primary-outline text-sm py-xs px-md cursor-pointer'>
                        Edit profile
                    </span>
                </TextLink>
            </section>

            <p className='paragraph-sm text-skin-text mt-lg'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. At nisl
                cursus a pulvinar ullamcorper purus amet, adipiscing. At nisl
                cursus a pulvinar ullamcorper purus amet, adipiscing.
            </p>

            <div className='flex items-center mt-lg'>
                <div className='flex items-center'>
                    <MdOutlineLocationOn className='text-md text-skin-text-light' />
                    <span className='text-sm text-skin-text-light ml-xs'>
                        Philippines
                    </span>
                </div>

                <div className='flex items-center ml-xl'>
                    <MdOutlineCake className='text-md text-skin-text-light' />
                    <span className='text-sm text-skin-text-light ml-xs'>
                        August 18, 1995
                    </span>
                </div>

                <div className='flex items-center ml-xl'>
                    <MdCalendarToday className='text-md text-skin-text-light' />
                    <span className='text-sm text-skin-text-light ml-xs'>
                        August 2020
                    </span>
                </div>
            </div>

            <div className='flex items-center mt-lg'>
                <TextLink href='/followers'>
                    <b className='text-skin-text font-semibold'>10</b>
                    <span className='text-skin-text-light ml-xs'>
                        Followers
                    </span>
                </TextLink>

                <TextLink className='ml-xl' href='/following'>
                    <b className='text-skin-text font-semibold'>20</b>
                    <span className='text-skin-text-light ml-xs'>
                        Following
                    </span>
                </TextLink>
            </div>
        </div>
    );
}
