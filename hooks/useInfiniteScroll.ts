import { useCallback, useRef, Ref } from 'react';
import {
    QueryKey,
    useInfiniteQuery,
    UseInfiniteQueryResult,
} from 'react-query';

type Meta = Record<string, string | number | boolean | undefined>;

interface ReturnType<V> {
    ref: Ref<V>;
}

export default function useInfiniteScroll<T, U, V = HTMLElement>(
    queryKey: QueryKey,
    meta: Meta,
    cacheTime: number,
    enabled = true,
): ReturnType<V> & UseInfiniteQueryResult<T> {
    const observer = useRef<IntersectionObserver | null>();

    const query = useInfiniteQuery<U, unknown, T>(queryKey, {
        enabled,
        meta,
        getNextPageParam: last => last.next_offset ?? false,
        cacheTime,
        select({ pageParams, pages }) {
            if (pages.length === 1) {
                return {
                    pageParams,
                    pages: pages[0].items,
                };
            }

            if (pages.length > 1) {
                return {
                    pageParams,
                    pages: pages.flatMap(page => [...page.items]),
                };
            }

            return { pageParams, pages: [] };
        },
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
