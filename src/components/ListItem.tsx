export default function ListItem({ children }: { children: React.ReactNode; }) {
    return (
        <li className='ms-2 mb-1 flex gap-2'>
            <p>-</p>
            <p>{children}</p>
        </li>
    );
}
