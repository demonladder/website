import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetLevel, Level, SearchLevels } from '../api/levels';
import SearchBox from '../components/SearchBox/SearchBox';

interface LevelSearchOptions {
    inPack?: boolean;
    defaultLevel?: number | null;
}

interface Props {
    ID: string,
    ref?: React.Ref<HTMLInputElement>,
    options?: LevelSearchOptions,
}

export default function useLevelSearch({ ID, options = {} }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeLevel, setActiveLevel] = useState<Level>();
    const [isInvalid, setIsInvalid] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const { data, status } = useQuery({
        queryKey: ['levelSearch', searchQuery],
        queryFn: () => SearchLevels({ ...options, name: searchQuery, exact: false, chunk: 5 }),
    });

    const { data: defaultData } = useQuery({
        queryKey: ['level', options.defaultLevel],
        queryFn: () => GetLevel(options.defaultLevel || null),
    });

    useEffect(() => {
        setIsInvalid(false);
    }, [search, activeLevel]);

    useEffect(() => {
        if (!defaultData) return;
        
        if (ref.current) ref.current.value = defaultData?.Name;
        setSearch(defaultData?.Name);
        setActiveLevel(defaultData);
    }, [defaultData]);

    function clear() {
        setSearch('');
        setSearchQuery('');
        setActiveLevel(undefined);
    }

    return {
        activeLevel,
        setQuery: setSearch,
        clear,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (<SearchBox search={search} onSearchChange={setSearch} id={ID} list={data?.levels.map((d) => ({
            ...d,
            label: d.Name + ' by ' + d.Creator + ` (${d.LevelID})`,
        })) || []} onDelayedChange={setSearchQuery} setResult={setActiveLevel} status={status} invalid={isInvalid} placeholder={defaultData?.Name} />),
    }
}