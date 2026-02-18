import Container from './Container';

interface Props extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, 'className'> {
    title?: string;
}

export default function Page({ title, children, onContextMenu, ...props }: Props) {
    return (
        <main {...props} className='grow py-4'>
            {title && <title>{title} - GD Demon Ladder</title>}
            <Container onContextMenu={onContextMenu}>{children}</Container>
        </main>
    );
}
