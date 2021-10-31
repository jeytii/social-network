export default function PostBox() {
    return (
        <section className='rounded-md bg-skin-bg-contrast'>
            <textarea
                className='text-skin-text w-full transparent resize-none rounded-t-md p-md'
                placeholder="What's on you mind?"
            />
            <div className='flex items-center py-sm px-md bg-skin-bg-contrast-light rounded-b-md'>
                <span
                    className='text-sm text-primary'
                    aria-label='Characters left'
                >
                    300
                </span>
                <button
                    className='btn-primary text-sm rounded-full ml-auto py-xs px-lg'
                    type='button'
                >
                    Post
                </button>
            </div>
        </section>
    );
}
