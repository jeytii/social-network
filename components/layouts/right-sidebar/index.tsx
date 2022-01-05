import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Spinner from 'components/vectors/Spinner';

const UserFilterer = dynamic(() => import('./UserFilterer'), {
    loading: () => <Spinner />,
});
const RandomSuggestions = dynamic(() => import('./RandomSuggestions'), {
    loading: () => <Spinner />,
});

export default function RightSidebar() {
    const { route } = useRouter();

    return (
        <aside className='w-[280px] sticky full-height left-[0px] border-l border-skin-main p-lg'>
            {route === '/search' ? <UserFilterer /> : <RandomSuggestions />}
        </aside>
    );
}
