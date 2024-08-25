export default function FormGroup({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={'my-4' + (className ? ' '+className : '')}>
            {children}
        </div>
    );
}