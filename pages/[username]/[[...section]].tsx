import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import { IconType } from 'react-icons';
import {
    MdLibraryBooks,
    MdThumbUp,
    MdForum,
    MdBookmarks,
} from 'react-icons/md';
import Protected from 'components/Protected';
import Spinner from 'components/vectors/Spinner';
import ProfileHeadline from 'components/layouts/profile/Headline';
import useWindowSize from 'hooks/useWindowSize';
import useProfileSection from 'hooks/useProfileSection';
import clsx from 'clsx';

interface SectionLink {
    href: string;
    label: string;
    icon: IconType;
}

const sections: SectionLink[] = [
    { href: '', label: 'Posts', icon: MdLibraryBooks },
    { href: '/likes', label: 'Likes', icon: MdThumbUp },
    { href: '/comments', label: 'Comments', icon: MdForum },
    { href: '/bookmarks', label: 'Bookmarks', icon: MdBookmarks },
];

export default function ProfileSection() {
    const windowSize = useWindowSize();
    const isLandscapeTablet = useMediaQuery({ maxWidth: 690 }, windowSize);
    const { query, asPath } = useRouter();
    const Section = useProfileSection(query.section);
    const username = query.username || '';

    return (
        <Protected title='Profile'>
            {!Object.keys(query).length ? (
                <Spinner className='p-lg' />
            ) : (
                <div>
                    <ProfileHeadline />

                    <nav className='flex border-b border-skin-bg-contrast'>
                        {sections.map(({ href, label, icon: Icon }) => (
                            <div
                                key={label}
                                className='flex-1 text-center text-md'
                            >
                                <Link href={`/${username}${href}`}>
                                    <span
                                        className={clsx(
                                            'block py-sm cursor-pointer hover:bg-skin-bg-contrast',
                                            asPath === `/${username}${href}`
                                                ? 'active-profile-nav-link'
                                                : 'text-skin-text-light',
                                        )}
                                    >
                                        {isLandscapeTablet ? (
                                            <Icon className='block m-auto' />
                                        ) : (
                                            label
                                        )}
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <Section />
                </div>
            )}
        </Protected>
    );
}
