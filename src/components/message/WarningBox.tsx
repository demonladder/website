export default function WarningBox({ text }: { text: string|undefined }) {
    if (!text) return null;

    return (
        <div className='border-2 border-red-600 font-bold text-center p-2 my-2'>
            <p>{text}</p>
        </div>
    );
}