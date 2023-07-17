import { Level } from '../../../api/levels';

type Props = {
    level: Level,
    setSearch: (level: string) => void,
    setID: (id: number) => void,
}

export default function SearchResult({ level, setSearch, setID }: Props) {
    function clickHandler() {
        setSearch(level.Name)
        setID(level.ID);
    }

    return (
        <div className='result' onClick={clickHandler}>
            <b>{level.Name}</b>
            <span> by {level.Creator}</span>
        </div>
    );
}