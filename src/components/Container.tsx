export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={'container bg-opacity-90 mx-auto my-6 px-14 py-8 bg-gray-800 round:rounded-3xl' + (className ? ' '+className : '')}>
            {children}
        </div>
    );
}