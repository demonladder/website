import Container from './Container';

export default function Page({ children, onContextMenu, ...props }: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, 'className'>) {
    return (
        <main {...props} className='py-4'>
            <Container onContextMenu={onContextMenu}>
                {children}
            </Container>
        </main>
    );
}
