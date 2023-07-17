export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={'container mx-auto mt-6 px-14 py-8 mb-20' + (className ? ' '+className : '')}>
            {children}
        </div>
    );
}