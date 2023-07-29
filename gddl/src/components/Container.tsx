export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={'container mx-auto mt-6 px-14 py-8 bg-gray-800 round:rounded-3xl' + (className ? ' '+className : '')}>
            {children}
        </div>
    );
}