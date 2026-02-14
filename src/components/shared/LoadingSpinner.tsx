export default function LoadingSpinner({ isLoading = true }) {
    if (!isLoading) return;

    return (
        <span className='flex justify-center items-center gap-1'>
            <i className='bx bxs-hourglass bx-tada' />
            Loading
        </span>
    );
}
