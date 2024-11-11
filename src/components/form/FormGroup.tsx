export default function FormGroup({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={'mt-4' + (className ? ' '+className : '')}>
            {children}
        </div>
    );
}