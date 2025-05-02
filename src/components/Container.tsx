export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={'container mx-auto px-4 sm:px-14 py-8 bg-theme-800/90 md:border border-theme-outline shadow-lg round:rounded-3xl' + (className ? ' ' + className : '')}>
            {children}
        </div>
    );
}
