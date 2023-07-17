interface Props {
    msg: string,
    onClick: () => void,
}

export default function SearchResult({ msg, onClick }: Props) {
    return (
        <div className='px-2 py-1 hover:bg-gray-700 cursor-pointer'>
            <p className='m-0' onClick={onClick}>{msg}</p>
        </div>
    );
}