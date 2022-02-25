import { useRouter } from 'next/router';
import { lazy, Suspense } from 'react';
import Spinner from 'components/utilities/Spinner';

const UserFilterer = lazy(() => import('./UserFilterer'));
const RandomSuggestions = lazy(() => import('./RandomSuggestions'));

export default function RightSidebar() {
    const { route } = useRouter();

    return (
        <aside className='w-[280px] sticky full-height left-[0px] bg-skin-main border-l border-skin-main p-lg'>
            {route === '/search' ? (
                <Suspense fallback={<Spinner />}>
                    <UserFilterer />
                </Suspense>
            ) : (
                <Suspense fallback={<Spinner />}>
                    <RandomSuggestions />
                </Suspense>
            )}
        </aside>
    );
}
