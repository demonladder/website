export default function WarningBox({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-amber-400/40 border-s-4 border-amber-400 round:rounded-lg p-2 my-4'>
            <p className='font-bold'>
                <i className='bx bxs-error text-xl' /> Warning
            </p>
            <div>{children}</div>
        </div>
    );
}
