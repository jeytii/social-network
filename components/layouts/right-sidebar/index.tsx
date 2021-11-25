import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Spinner from 'components/vectors/Spinner';

const loading = () => (
    <Spinner className='w-[280px] sticky full-height left-[0px] bg-skin-bg-contrast-light p-lg' />
);

const UserFilterer = dynamic(() => import('./UserFilterer'), { loading });
const RandomSuggestions = dynamic(() => import('./RandomSuggestions'), {
    loading,
});

export default function RightSidebar() {
    const { route } = useRouter();

    if (route === '/search') {
        return <UserFilterer />;
    }

    return <RandomSuggestions />;
}
