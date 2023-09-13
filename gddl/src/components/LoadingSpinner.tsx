export default function LoadingSpinner({ isLoading = true }) {
    if (!isLoading) return;

    return (
        <div className='flex justify-center gap-1'>
            <i className='bx bxs-hourglass bx-tada'></i>
            Loading
        </div>
    );
}