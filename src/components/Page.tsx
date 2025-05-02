import Container from './Container';

export default function Page({ children, ...props }: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, 'className'>) {
    return (
        <main {...props} className='py-4'>
            <Container>
                {children}
            </Container>
        </main>
    );
}
