export default function Footer() {
    return (
        <footer className='grid place-items-center bg-gray-950 py-6'>
            <p>v{APP_VERSION}{import.meta.env.DEV && '-d'}</p>
        </footer>
    );
}