export default function FormGroup({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <dl className={'my-4' + (className ? ' '+className : '')}>
            {children}
        </dl>
    );
}