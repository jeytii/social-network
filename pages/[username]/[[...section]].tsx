import Link from 'next/link';
import { useRouter } from 'next/router';
import Protected from 'components/Protected';
import Spinner from 'components/vectors/Spinner';
import ProfileHeadline from 'components/layouts/profile/Headline';
import useProfileSection from 'hooks/useProfileSection';
import clsx from 'clsx';

interface SectionLink {
    href: string;
    label: string;
}

const sections: SectionLink[] = [
    { href: '', label: 'Posts' },
    { href: '/likes', label: 'Likes' },
    { href: '/comments', label: 'Comments' },
    { href: '/bookmarks', label: 'Bookmarks' },
];

export default function ProfileSection() {
    const { query, asPath } = useRouter();
    const Section = useProfileSection(query.section);
    const username = query.username || '';

    return (
        <Protected title="Profile">
            {!Object.keys(query).length ? <Spinner className="p-lg" /> : (
                <div>
                    <ProfileHeadline />

                    <nav className="flex border-b border-skin-bg-contrast">
                        {sections.map(({ href, label }) => (
                            <div className="flex-1 text-center text-sm">
                                <Link href={`/${username}${href}`}>
                                    <span
                                        className={clsx(
                                            'block py-sm cursor-pointer hover:bg-skin-bg-contrast',
                                            asPath === `/${username}${href}` ? 'active-profile-nav-link' : 'text-skin-text-light',
                                        )}
                                    >
                                        {label}
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
