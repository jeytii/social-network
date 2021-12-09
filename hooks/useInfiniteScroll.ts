import { useCallback, useRef } from 'react';
import {
    QueryKey,
    useInfiniteQuery,
    UseInfiniteQueryOptions,
} from 'react-query';
import { UserPage, PostPage, CommentPage, NotificationPage } from 'types/page';
import { User } from 'types/user';
import { Post } from 'types/post';
import { Comment } from 'types/comment';
import { Notification } from 'types/notification';

type Page = UserPage | PostPage | CommentPage | NotificationPage;
type Model = User | Post | Comment | Notification;

interface Props<T, U> extends UseInfiniteQueryOptions<T, unknown, U> {
    queryKey: QueryKey;
}

export default function useInfiniteScroll<T extends Page, U extends Model>({
    queryKey,
    ...opts
}: Props<T, U>) {
    const observer = useRef<IntersectionObserver | null>();

    const query = useInfiniteQuery(queryKey, {
        ...opts,
        getNextPageParam: last => last.next_offset ?? false,
    });

    const ref = useCallback(
        node => {
            if (query.isFetchingNextPage) {
                return;
            }

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(async entries => {
                if (entries[0].isIntersecting) {
                    if (query.hasNextPage) {
                        query.fetchNextPage();
                    } else {
                        observer.current?.unobserve(node);
                    }
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [query.isFetchingNextPage, query.hasNextPage],
    );

    return { ref, ...query };
}
