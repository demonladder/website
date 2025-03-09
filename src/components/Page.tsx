import Container from './Container';

export default function Page({ children }: { children: React.ReactNode; }) {
    return (
        <main className='py-4'>
            <Container>
                {children}
            </Container>
        </main>
    );
}
