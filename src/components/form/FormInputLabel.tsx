export default function FormInputLabel({ children, htmlFor }: { children: string, htmlFor?: string }) {
    return (
        <label htmlFor={htmlFor} className='font-bold block mb-1'>{children}</label>
    );
}