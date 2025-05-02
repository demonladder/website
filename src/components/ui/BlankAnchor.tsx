export default function BlankAnchor({ children, href }: { children: string; href: string; }) {
    return <li className='group'>
        <a href={href} className='underline-t' target='_blank' rel='noopener noreferrer'>{children} <span className='opacity-0 group-hover:opacity-100 transition-opacity'><i className='bx bx-link-external' /></span></a>
    </li>;
}
