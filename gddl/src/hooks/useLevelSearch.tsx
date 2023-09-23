import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Level, SearchLevels } from '../api/levels';
import SearchBox from '../components/SearchBox/SearchBox';

interface LevelSearchOptions {
    inPack?: boolean
}

interface Props {
    ID: string,
    options?: LevelSearchOptions,
}

export default function useLevelSearch({ ID, options = {} }: Props) {
    const [search, setSearch] = useState('');
    const [activeLevel, setActiveLevel] = useState<Level>();
    const [isInvalid, setIsInvalid] = useState(false);

    const { data, status } = useQuery({
        queryKey: ['levelSearch', search],
        queryFn: () => SearchLevels({ ...options, name: search, exact: false, chunk: 5 }),
    });

    useEffect(() => {
        setIsInvalid(false);
    }, [search, activeLevel]);

    return {
        activeLevel,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (<SearchBox id={ID} list={data?.levels.map((d) => ({
            ...d,
            label: d.Name + ' by ' + d.Creator + ` (${d.LevelID})`,
        })) || []} update={setSearch} setResult={setActiveLevel} status={status} invalid={isInvalid} />)
    }
}