import useLocalStorage from './useLocalStorage';

export default function useLevelView(storageKey: string): [boolean, React.ReactElement] {
    const [isList, setIsList] = useLocalStorage(storageKey, true);

    function onViewList() {
        if (!isList) setIsList(true);
    }

    function onViewGrid() {
        if (isList) setIsList(false);
    }

    return [
        isList === true,
        <div>
            <span className='inline-block text-theme-text p-1 bg-theme-700 rounded-md'>
                <button
                    className={'px-2 py-1 rounded-lg me-1 transition-colors ' + (isList ? 'bg-theme-950' : '')}
                    onClick={onViewList}
                >
                    List
                </button>
                <button
                    className={'px-2 py-1 rounded-lg transition-colors ' + (!isList ? 'bg-theme-950' : '')}
                    onClick={onViewGrid}
                >
                    Grid
                </button>
            </span>
        </div>,
    ];
}
