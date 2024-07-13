export default function InlineLoadingSpinner({ isLoading = true }) {
    if (!isLoading) return;

    return (
        <i className='bx bx-loader-alt bx-spin' />
    );
}