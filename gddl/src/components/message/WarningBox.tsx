export default function WarningBox({ text }: { text: string|undefined }) {
    if (!text) return null;

    return (
        <div className='information warning'>
            <p>{text}</p>
        </div>
    );
}