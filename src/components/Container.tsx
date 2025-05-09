export default function Container({ children, className, onContextMenu }: { children: React.ReactNode, className?: string, onContextMenu?: React.MouseEventHandler<HTMLElement> }) {
    return (
        <div className={'container mx-auto px-4 sm:px-14 py-8 bg-theme-800/90 md:border border-theme-outline shadow-lg round:rounded-3xl' + (className ? ' ' + className : '')} onContextMenu={onContextMenu}>
            {children}
        </div>
    );
}
