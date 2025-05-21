export function UserStat({ children, label, title }: { children: React.ReactNode; label: string; title?: string; }) {
    return (
        <div title={title}>
            <p className='text-theme-400'>{label}</p>
            <b className='text-2xl'>{children}</b>
        </div>
    );
}
