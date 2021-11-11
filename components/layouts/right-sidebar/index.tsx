import { useRouter } from 'next/router';
import RandomSuggestions from './RandomSuggestions';
import UserFilterer from './UserFilterer';

export default function RightSidebar() {
    const { asPath } = useRouter();

    if (asPath === '/search') {
        return <UserFilterer />;
    }

    return <RandomSuggestions />;
}
