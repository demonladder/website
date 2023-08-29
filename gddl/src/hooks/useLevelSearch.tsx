import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Level, SearchLevels } from '../api/levels';
import SearchBox from '../components/SearchBox/SearchBox';

interface Props {
    ID: string,
}

export default function useLevelSearch({ ID }: Props) {
    const [search, setSearch] = useState('');
    const [activeLevel, setActiveLevel] = useState<Level>();
    const [isInvalid, setIsInvalid] = useState(false);

    const { data, status } = useQuery({
        queryKey: ['levelSearch', search],
        queryFn: () => SearchLevels({ name: search, exact: false, chunk: 5 }),
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