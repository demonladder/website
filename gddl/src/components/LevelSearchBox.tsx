import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Level, SearchLevels } from '../api/levels';
import SearchBox from './SearchBox/SearchBox';

type Props = {
    setResult: (e: any) => void,
    id?: string,
    className?: string,
}

type Label = {
    label: string,
}

export default function LevelSearchBox({ setResult, id }: Props) {
    const [search, setSearch] = useState('');

    const { status, data } = useQuery({
        queryKey: ['level/search', search],
        queryFn: () => SearchLevels({ name: search, exact: false, chunk: 5 }),
    });

    if (data === undefined) return <></>;
    return <SearchBox id={id} list={data && data.levels.map((d) => {
        const l: Level & Label = {
            ...d,
            label: d.Name + ' by ' + d.Creator + ` (${d.LevelID})`,
        }
        return l;
    })} update={setSearch} setResult={setResult} status={status} />
}