import { useMediaQuery } from 'react-responsive';
import {
    MdOutlineHome,
    MdOutlineGroups,
    MdOutlineNotifications,
    MdAccountCircle,
    MdOutlineSettings,
} from 'react-icons/md';
import clsx from 'clsx';

export default function LeftSidebar() {
    const isPortrait = useMediaQuery({ minWidth: 690 });

    return (
        <aside className={clsx(
            'sticky top-[61px] left-[0px] full-height bg-skin-bg-contrast-light',
            isPortrait ? 'w-[210px]' : 'auto',
        )}
        >
            <nav>
                <a
                    className="flex items-center no-underline bg-skin-bg-contrast-light text-primary p-lg hover:bg-skin-bg-contrast-light"
                    href="/"
                    aria-label="Home link"
                >
                    <MdOutlineHome className="text-xl" />
                    {isPortrait && <span className="ml-lg">Home</span>}
                </a>

                <a
                    className="flex items-center no-underline text-skin-text-light p-lg hover:bg-skin-bg-contrast-light"
                    href="/"
                    aria-label="Profile link"
                >
                    <MdAccountCircle className="text-xl" />
                    {isPortrait && <span className="ml-lg">Profile</span>}
                </a>

                <a
                    className="flex items-center no-underline text-skin-text-light p-lg hover:bg-skin-bg-contrast-light"
                    href="/"
                    aria-label="Notifications link"
                >
                    <MdOutlineNotifications className="text-xl" />
                    {isPortrait && <span className="ml-lg">Notifications</span>}
                </a>

                <a
                    className="flex items-center no-underline text-skin-text-light p-lg hover:bg-skin-bg-contrast-light"
                    href="/"
                    aria-label="Search link"
                >
                    <MdOutlineGroups className="text-xl" />
                    {isPortrait && <span className="ml-lg">Search people</span>}
                </a>

                <a
                    className="flex items-center no-underline text-skin-text-light p-lg hover:bg-skin-bg-contrast-light"
                    href="/"
                    aria-label="Settings link"
                >
                    <MdOutlineSettings className="text-xl" />
                    {isPortrait && <span className="ml-lg">Settings</span>}
                </a>
            </nav>
        </aside>
    );
}
