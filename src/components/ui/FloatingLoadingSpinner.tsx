export default function FloatingLoadingSpinner({ isLoading = true }) {
    if (!isLoading) return;

    return (
        <div className='absolute grid place-items-center inset-0 bg-black/30 pointer-events-none'>
            <div className='flex items-center gap-1 text-xl'>
                <i className='bx bxs-hourglass bx-tada' />
                <span>Loading</span>
            </div>
        </div>
    );
}
