export default function SuccessBox({ text }: { text: string|undefined }) {
    if (!text) return null;

    return (
        <div className='information success'>
            <p>{text}</p>
        </div>
    );
}