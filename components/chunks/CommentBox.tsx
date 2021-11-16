export default function CommentBox() {
    return (
        <section className='flex gap-sm items-start mt-lg'>
            <form className='flex-1'>
                <textarea
                    className='block bg-skin-bg-contrast text-skin-text text-md w-full py-sm px-md border border-skin-bg-contrast rounded-3xl resize-none overflow-x-hidden disabled:opacity-7 disabled:text-skin-text-light disabled:cursor-not-allowed'
                    placeholder='Write a comment'
                    aria-label='Comment box'
                    rows={1}
                />
                <input className='hidden' type='submit' />
            </form>

            <span className='w-[44px] h-[44px] flex items-center justify-center bg-skin-bg-contrast text-primary text-sm px-sm rounded-full'>
                300
            </span>
        </section>
    );
}
