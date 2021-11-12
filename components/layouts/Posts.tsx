import { Fragment, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import Cookies from 'js-cookie';
import Post from 'components/chunks/Post';
import Select from 'components/utilities/Select';
import Spinner from 'components/vectors/Spinner';
import axios from 'config/axios';
import type { PostPage } from 'types/page';

const items = [
    { label: 'Timestamp', value: 'created_at' },
    { label: 'Number of likes', value: 'likes' },
];

async function getPosts() {
    const { data } = await axios(Cookies.get('token')).get('/api/posts');

    return data;
}

export default function Posts() {
    const { data, isLoading, isSuccess, refetch } = useInfiniteQuery<PostPage>(
        'posts',
        getPosts,
        {
            enabled: false,
            getNextPageParam: last => (last.has_more ? last.next_offset : null),
        },
    );

    useEffect(() => {
        refetch();
    }, []);

    if (isLoading) {
        return <Spinner className='p-lg' />;
    }

    if (isSuccess && !!data?.pages && !data?.pages[0].items.length) {
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
                {data?.pages?.map(page => (
                    <Fragment key={page.next_offset}>
                        {page.items.map(post => (
                            <Post key={post.slug} className='mt-lg' {...post} />
                        ))}
                    </Fragment>
                ))}
            </div>
        </section>
    );
}
