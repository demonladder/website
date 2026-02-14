import './segmentedButtonGroup.css';

interface SegmentedButtonProps {
    isActive?: boolean;
    isFirst: boolean;
    isLast: boolean;
    buttonCount: number;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function SegmentedButton({ children, onClick, isActive = false, isFirst, isLast, buttonCount }: SegmentedButtonProps) {
    const classes = [];
    if (isActive) classes.push('selected');
    if (isFirst) classes.push('first');
    if (isLast) classes.push('last');

    return (
        <button
            type='button'
            className={classes.join(' ')}
            style={{ width: `${(1 / buttonCount) * 100}%` }}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

interface Props<T extends Record<string, string>> {
    options: T;
    activeKey?: keyof T;
    onSetActive?: (key: keyof T) => void;
}

export default function SegmentedButtonGroup<T extends Record<string, string>>({
    options,
    activeKey,
    onSetActive,
}: Props<T>) {
    return (
        <div className='segmented-button-group'>
            {Object.entries(options).map(([key, label], i, arr) => (
                <SegmentedButton
                    key={key}
                    buttonCount={arr.length}
                    isActive={activeKey === key}
                    onClick={() => onSetActive?.(key)}
                    isFirst={i === 0}
                    isLast={i === arr.length - 1}
                >
                    {label}
                </SegmentedButton>
            ))}
        </div>
    );
}
