export default function LoadingSpinner({ isLoading = true }) {
    if (!isLoading) return <></>;

    return (
        <div className='flex justify-center gap-1'>
            Loading
            <div className='spinner self-center' />
        </div>
    );
}