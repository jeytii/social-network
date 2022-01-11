import { ChangeEvent, useRef, useState } from 'react';
import { useQuery, useQueryClient, QueryFunctionContext } from 'react-query';
import { MdSearch } from 'react-icons/md';
import clsx from 'clsx';
import SearchSuggestions from 'components/chunks/SearchSuggestions';
import Spinner from 'components/vectors/Spinner';
import useDebounceChange from 'hooks/useDebounceChange';
import { axiosClient } from 'config/axios';
import { User } from 'types/user';

const getResults = async ({ meta }: QueryFunctionContext) => {
    const { data } = await axiosClient().get('/api/users/search', {
        params: { query: meta?.query },
    });

    return data.data;
};

export default function Searchbar() {
    const [query, setQuery] = useState<string>('');
    const [showResults, setShowResults] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const queryClient = useQueryClient();
    const { data, refetch, isFetching, isSuccess } = useQuery<User[]>(
        'search',
        getResults,
        {
            enabled: false,
            meta: { query },
        },
    );

    function handleQuery(event: ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    function truncateResults() {
        queryClient.setQueryData('search', []);
    }

    function focus() {
        setShowResults(true);
    }

    function blur() {
        setShowResults(false);
    }

    useDebounceChange(query, refetch, truncateResults);

    return (
        <section
            className={clsx(
                'relative w-[300px] ml-lg sm:max-w-none sm:w-full sm:ml-auto',
                isSuccess && !!data?.length && showResults
                    ? 'rounded-t'
                    : 'rounded-full',
            )}
        >
            <form
                className={clsx(
                    'bg-skin-main border border-skin-main flex',
                    isSuccess && !!data?.length && showResults
                        ? 'rounded-t'
                        : 'rounded-full',
                )}
                method='get'
                action='/search'
            >
                <input
                    ref={inputRef}
                    className={clsx(
                        'transparent flex-1 w-full text-skin-primary text-sm border-none py-xs px-sm',
                        isSuccess && !!data?.length && showResults
                            ? 'rounded-tl'
                            : 'rounded-l-full',
                    )}
                    type='text'
                    name='query'
                    value={query}
                    placeholder='Search'
                    onChange={handleQuery}
                    onFocus={focus}
                />

                {isFetching ? (
                    <Spinner
                        className={clsx(
                            'flex items-center justify-center px-sm',
                            isSuccess && !!data?.length && showResults
                                ? 'rounded-tr'
                                : 'rounded-r-full',
                        )}
                        size={20}
                    />
                ) : (
                    <div
                        className={clsx(
                            'flex items-center justify-center px-sm',
                            isSuccess && !!data?.length && showResults
                                ? 'rounded-tr'
                                : 'rounded-r-full',
                        )}
                    >
                        <MdSearch
                            className='text-md text-skin-secondary'
                            viewBox='2 2 20 20'
                        />
                    </div>
                )}

                <input className='hidden' type='submit' />
            </form>

            {isSuccess && !!data?.length && showResults && (
                <SearchSuggestions
                    data={data}
                    target={inputRef}
                    hideEvent={blur}
                />
            )}
        </section>
    );
}
