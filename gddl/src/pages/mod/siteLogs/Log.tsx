import { useState } from 'react';
import LogResponse from '../../../api/types/LogResponse';

function removeStack(payload: Record<string, any> & { stack?: string }) {
    const filtered: Record<string, any> = {};

    for (const key of Object.keys(payload)) {
        if (key !== 'stack') filtered[key] = payload[key];
    }

    return filtered;
}

function RenderPayload({ payload }: { payload: string | null }) {
    if (payload === null) return;

    try {
        const parsed = JSON.parse(payload);

        if (parsed.stack) return (
            <>
                <pre className='bg-gray-900 p-1 rounded mb-1'>{JSON.stringify(removeStack(parsed), null, 4)}</pre>
                <pre className='bg-gray-900 p-1 rounded'>{parsed.stack}</pre>
            </>
        );

        return <pre className='bg-gray-900 p-1 rounded'>{JSON.stringify(parsed, null, 4)}</pre>
    } catch (err) {
        return <p>{payload}</p>
    }
}

export default function Log({ log }: { log: LogResponse }) {
    const [collapsed, setCollapsed] = useState(true);

    function toggleOpen() {
        if (collapsed && log.Payload === null) return;
        setCollapsed(!collapsed);
    }

    return (
        <div className={(log.Payload !== null ? 'cursor-pointer' : 'cursor-default') + ' select-none p-2 bg-gray-600 round:rounded'} onClick={toggleOpen}>
            <div className='flex justify-between'>
                <p><code>[{log.LogTime}]</code>: {log.Message} </p>
                {log.Payload !== null && (collapsed
                    ? <i className='bx bx-chevron-down' />
                    : <i className='bx bx-chevron-up' />
                )}
            </div>
            {!collapsed &&
                <div className='mt-2'>
                    <RenderPayload payload={log.Payload} />
                </div>
            }
        </div>
    );
}