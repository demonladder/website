import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Level, SearchLevels } from '../api/levels';
import SearchBox from './SearchBox/SearchBox';

interface Props {
    setResult: (e: any) => void,
    id?: string,
    invalid?: boolean,
}

type Label = {
    label: string,
}

export default function LevelSearchBox({ setResult, id, invalid = false }: Props) {
    const [search, setSearch] = useState('');

    const { status, data = {levels:[]} } = useQuery({
        queryKey: ['level/search', search],
        queryFn: () => SearchLevels({ name: search, exact: false, chunk: 5 }),
    });

    return (
        <SearchBox id={id} list={data && data.levels.map((d) => {
            const l: Level & Label = {
                ...d,
                label: d.Name + ' by ' + d.Creator + ` (${d.LevelID})`,
            }
            return l;
        })} update={setSearch} setResult={setResult} status={status} invalid={invalid} />
    )
};