export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={'container mx-auto my-6 px-14 py-8 bg-gray-800 bg-opacity-90 text-white round:rounded-3xl' + (className ? ' '+className : '')}>
            {children}
        </div>
    );
}
