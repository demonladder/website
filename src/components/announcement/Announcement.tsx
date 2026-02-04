export default function Announcement({ children }: { children: React.ReactNode }) {
    return (
        <div className='text-center px-6 lg:px-24 py-12'>
            {children}
        </div>
    );
}
