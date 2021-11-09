import { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import Post from 'components/chunks/Post';
import Select from 'components/utilities/Select';
import Spinner from 'components/vectors/Spinner';
import axios from 'config/axios';
import type { Post as PostType } from 'types/post';

interface Page {
    items: PostType[];
    has_more: boolean;
    next_offset: number | null;
    status: number;
}

const items = [
    { label: 'Timestamp', value: 'created_at' },
    { label: 'Number of likes', value: 'likes' },
];

async function getPosts() {
    const { data } = await axios().get('/api/posts');

    return data;
}

function formatData(pages: Page[] | undefined) {
    if (!pages || !pages.length) {
        return [];
    }

    if (pages.length === 1) {
        return pages[0].items;
    }

    return pages.flatMap(page => [...page.items]);
}

export default function Posts() {
    const { data, isLoading, isSuccess, refetch } = useInfiniteQuery(
        'posts',
        getPosts,
        {
            enabled: false,
        },
    );

    const pages = formatData(data?.pages);

    useEffect(() => {
        refetch();
    }, []);

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !pages.length) {
        return (
            <section className='p-lg'>
                <h1 className='text-md text-skin-text-light text-center'>
                    Post something or follow someone to fill your news feed.
                </h1>
            </section>
        );
    }

    return (
        <section className='mt-lg'>
            <div className='block mt-lg' aria-label='Sorting options'>
                <span className='text-skin-text text-sm'>Sort by:</span>
                <Select
                    className='text-skin-text-light text-sm bg-skin-bg ml-sm cursor-pointer'
                    items={items}
                    defaultValue='created_at'
                />
            </div>

            <div>
                {pages.map(page => (
                    <Post key={page.slug} className='mt-lg' {...page} />
                ))}
            </div>
        </section>
    );
}
