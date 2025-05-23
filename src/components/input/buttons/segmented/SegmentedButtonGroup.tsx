interface SegmentedButtonProps {
    isActive?: boolean;
    isFirst: boolean;
    isLast: boolean;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function SegmentedButton({ children, onClick, isActive = false, isFirst, isLast }: SegmentedButtonProps) {
    return (
        <button className={`flex items-center outline ${isFirst ? 'rounded-s-3xl' : ''} ${isLast ? 'rounded-e-3xl' : ''} ps-2 pe-4 h-10 transition-all ${isActive ? 'bg-secondary-container' : ''}`} onClick={onClick}><i className='bx bx-check text-2xl' hidden={!isActive} /> <span className='ps-2'>{children}</span></button>
    );
}

interface Props<T extends Record<string, string>> {
    options: T;
    activeKey?: keyof T;
    onSetActive?: (key: keyof T) => void;
}

export default function SegmentedButtonGroup<T extends Record<string, string>>({ options, activeKey, onSetActive }: Props<T>) {
    return (
        <div className='flex'>
            {Object.entries(options).map(([key, label], i, arr) => (
                <SegmentedButton key={key} isActive={activeKey === key} onClick={() => onSetActive?.(key)} isFirst={i === 0} isLast={i === arr.length - 1}>{label}</SegmentedButton>
            ))}
        </div>
    );
}
