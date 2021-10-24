import Protected from 'components/Protected';
import Post from 'components/chunks/Post';
import PostBox from 'components/chunks/PostBox';
import Select from 'components/utilities/Select';

const items = [
    { label: 'Timestamp', value: 'created_at' },
    { label: 'Number of likes', value: 'likes' },
];

export default function Home() {
    return (
        <Protected title="Home">
            <PostBox />

            <div className="block mt-lg" aria-label="Sorting options">
                <span className="text-skin-text text-sm">Sort by:</span>
                <Select
                    className="text-skin-text-light text-sm bg-skin-bg ml-sm cursor-pointer"
                    items={items}
                    defaultValue="created_at"
                />
            </div>

            <section className="mt-lg">
                <Post />
                <Post className="mt-lg" />
                <Post className="mt-lg" />
            </section>
        </Protected>
    );
}
