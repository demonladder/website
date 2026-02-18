import { RefreshCw } from '@boxicons/react';

export default function InlineLoadingSpinner({ isLoading = true }) {
    if (!isLoading) return;

    return <RefreshCw className='spinner' size='sm' />;
}
