import Link from 'next/link';
import {
    MdOutlineHome,
    MdOutlineGroups,
    MdOutlineNotifications,
    MdAccountCircle,
    MdOutlineSettings,
} from 'react-icons/md';

export default function BottomNav() {
    return (
        <nav className="sticky bottom-[0px] left-[0px] bg-skin-bg shadow-inner">
            <div className="flex bg-skin-bg-contrast">
                <Link href="/">
                    <span className="flex-1 py-md text-skin-text-light cursor-pointer">
                        <MdOutlineHome className="text-lg text-primary m-auto" />
                    </span>
                </Link>

                <Link href="/">
                    <span className="flex-1 py-md text-skin-text-light cursor-pointer">
                        <MdAccountCircle className="text-lg m-auto" />
                    </span>
                </Link>

                <Link href="/">
                    <span className="flex-1 py-md text-skin-text-light cursor-pointer">
                        <MdOutlineNotifications className="text-lg m-auto" />
                    </span>
                </Link>

                <Link href="/">
                    <span className="flex-1 py-md text-skin-text-light cursor-pointer">
                        <MdOutlineGroups className="text-lg m-auto" />
                    </span>
                </Link>

                <Link href="/">
                    <span className="flex-1 py-md text-skin-text-light cursor-pointer">
                        <MdOutlineSettings className="text-lg m-auto" />
                    </span>
                </Link>
            </div>
        </nav>
    );
}
