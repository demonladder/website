import ms from 'ms';
import { useMemo } from 'react';

interface Props {
    ID: string;
    TTL?: number;
}

export default function NewLabel({ ID, TTL = ms('3d') }: Props) {
    const seenAt = useMemo(() => {
        const store = JSON.parse(localStorage.getItem('newLabels') ?? '{}') as Record<string, number>;
        if (!store[ID]) {
            store[ID] = Date.now();
            localStorage.setItem('newLabels', JSON.stringify(store));
            return store[ID];
        }

        return store[ID];
    }, [ID]);

    if (seenAt + TTL < Date.now()) return;

    return (
        <span className='px-1 rounded bg-red-600'>new</span>
    );
}
