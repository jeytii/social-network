import { useQueryClient, InfiniteData } from 'react-query';
import type { Page } from 'types/page';
import type { User } from 'types/user';
import type { Post } from 'types/post';
import type { Comment } from 'types/comment';

type ReturnType = (User | Post | Comment)[];

export default function useFormatInfiniteData(queryKey: string): ReturnType {
    const queryClient = useQueryClient();

    const posts = queryClient.getQueryData<InfiniteData<Page>>(queryKey);

    if (!posts?.pages.length) {
        return [];
    }

    if (posts?.pages.length === 1) {
        return posts?.pages[0].items;
    }

    return posts?.pages.flatMap(page => [...page.items]);
}
