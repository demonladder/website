interface Props {
    completed: number;
    total: number;
}

export function Progress({ completed, total }: Props) {
    return (
        <div className='my-4'>
            <div className='h-6 bg-red-400 round:rounded-xl overflow-hidden'>
                <span className='inline-block h-6 bg-green-400' style={{ width: `${(completed / total) * 100}%` }} />
            </div>
            <p>
                {completed} completed out of {total}
            </p>
        </div>
    );
}
