import { MdOutlinePersonRemove, MdPersonAddAlt } from 'react-icons/md';
import BasicInfo from 'components/utilities/BasicInfo';

export default function RightSidebar() {
    return (
        <aside className="w-[280px] sticky top-[61px] left-[0px] full-height bg-skin-bg-contrast-light p-lg">
            <header className="flex items-center">
                <h3 className="text-skin-text-light text-sm font-bold">Search people</h3>
                <a className="text-primary text-xs ml-auto" href="/">See all</a>
            </header>

            <section className="mt-sm">
                <div className="flex items-center bg-primary-lighter rounded-md p-sm">
                    <BasicInfo name="John Doe" username="@john.doe" gender="Male" imageUrl="/" imageSize={40} />

                    <button type="button" className="rounded-full p-sm ml-auto hover:bg-primary-lighter">
                        <MdPersonAddAlt className="text-lg text-primary" />
                    </button>
                </div>

                <div className="flex items-center bg-primary-lighter rounded-md p-sm mt-sm">
                    <BasicInfo name="John Doe" username="@john.doe" gender="Male" imageUrl="/" imageSize={40} />

                    <button type="button" className="rounded-full p-sm ml-auto hover:bg-primary-lighter">
                        <MdPersonAddAlt className="text-lg text-primary" />
                    </button>
                </div>

                <div className="flex items-center bg-primary-lighter rounded-md p-sm mt-sm">
                    <BasicInfo name="John Doe" username="@john.doe" gender="Male" imageUrl="/" imageSize={40} />

                    <button type="button" className="rounded-full p-sm ml-auto hover:bg-danger-lighter">
                        <MdOutlinePersonRemove className="text-lg text-danger" />
                    </button>
                </div>
            </section>
        </aside>
    );
}
