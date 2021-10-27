import Protected from 'components/Protected';
import Post from 'components/chunks/Post';
import Comment from 'components/chunks/Comment';
import CommentBox from 'components/chunks/CommentBox';

export default function ViewPost() {
    return (
        <Protected title="Sosyal.me">
            <div className="p-lg">
                <Post />

                <CommentBox />

                <section className="mt-lg">
                    <Comment />
                    <Comment className="mt-lg" />
                    <Comment className="mt-lg" />
                </section>
            </div>
        </Protected>
    );
}
