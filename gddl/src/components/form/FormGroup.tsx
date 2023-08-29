export default function FormGroup({ children }: { children?: React.ReactNode }) {
    return (
        <dl className='my-4'>
            {children}
        </dl>
    );
}