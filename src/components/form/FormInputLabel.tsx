export default function FormInputLabel({ children, htmlFor }: { children: React.ReactNode, htmlFor?: string }) {
    return (
        <label htmlFor={htmlFor} className='font-bold block mb-1'>{children}</label>
    );
}
