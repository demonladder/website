export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={'container mx-auto px-14 py-8 bg-gray-800/90 text-white round:rounded-3xl' + (className ? ' ' + className : '')}>
            {children}
        </div>
    );
}
