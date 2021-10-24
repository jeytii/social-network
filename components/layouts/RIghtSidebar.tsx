import { MdAccountCircle, MdOutlinePersonRemove, MdPersonAddAlt } from 'react-icons/md';

export default function RightSidebar() {
    return (
        <aside className="w-[280px] sticky top-[61px] left-[0px] full-height bg-skin-bg-contrast-light p-lg">
            <header className="flex items-center">
                <h3 className="text-skin-text-light font-bold">Search people</h3>
                <a className="text-primary text-sm ml-auto" href="/">See all</a>
            </header>

            <section className="mt-sm">
                <div className="flex items-center bg-primary-lighter rounded-md p-sm">
                    <MdAccountCircle className="w-[40px] h-[40px] text-skin-text-light" />

                    <div className="ml-sm">
                        <span className="block text-skin-text font-bold text-xs">John Doe</span>
                        <span className="block text-skin-text-light text-xs">@john.doe</span>
                    </div>

                    <button type="button" className="bg-primary-lighter rounded-full p-sm ml-auto">
                        <MdPersonAddAlt className="text-lg text-primary" />
                    </button>
                </div>

                <div className="flex items-center bg-primary-lighter rounded-md p-sm mt-sm">
                    <MdAccountCircle className="w-[40px] h-[40px] text-skin-text-light" />

                    <div className="ml-sm">
                        <span className="block text-skin-text font-bold text-xs">John Doe</span>
                        <span className="block text-skin-text-light text-xs">@john.doe</span>
                    </div>

                    <button type="button" className="bg-primary-lighter rounded-full p-sm ml-auto">
                        <MdPersonAddAlt className="text-lg text-primary" />
                    </button>
                </div>

                <div className="flex items-center bg-primary-lighter rounded-md p-sm mt-sm">
                    <MdAccountCircle className="w-[40px] h-[40px] text-skin-text-light" />

                    <div className="ml-sm">
                        <span className="block text-skin-text font-bold text-xs">John Doe</span>
                        <span className="block text-skin-text-light text-xs">@john.doe</span>
                    </div>

                    <button type="button" className="bg-danger-lighter rounded-full p-sm ml-auto">
                        <MdOutlinePersonRemove className="text-lg text-danger" />
                    </button>
                </div>
            </section>
        </aside>
    );
}
