export default function Title({ children }: { children: React.ReactNode; }) {
    return (
        <h1 className='text-4xl mb-2'>{children}</h1>
    );
}
