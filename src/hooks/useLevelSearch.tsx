import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import GetLevel from '../api/level/GetLevel';
import SearchLevels from '../api/level/SearchLevels';
import { FullLevel } from '../api/types/compounds/FullLevel';
import SearchBox from '../components/SearchBox/SearchBox';

interface LevelSearchOptions {
    inPack?: boolean;
    defaultLevel?: number | null;
}

interface Props {
    ID: string,
    ref?: React.Ref<HTMLInputElement>,
    required?: boolean;
    options?: LevelSearchOptions,
}

export default function useLevelSearch({ ID, required = false, options = {} }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeLevel, setActiveLevel] = useState<FullLevel>();
    const [isInvalid, setIsInvalid] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const { data, status } = useQuery({
        queryKey: ['levelSearch', searchQuery],
        queryFn: () => SearchLevels({ ...options, name: searchQuery, limit: 5 }),
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
        
        if (ref.current) ref.current.value = defaultData?.Meta.Name;
        setSearch(defaultData?.Meta.Name);
        setActiveLevel(defaultData);
    }, [defaultData]);

    function clear() {
        setSearch('');
        setSearchQuery('');
        setActiveLevel(undefined);
    }

    function setQuery(query: string) {
        setSearch(query);
        setSearchQuery(query);
    }

    return {
        activeLevel,
        setQuery,
        clear,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (<SearchBox search={search} getLabel={(r) => `${r.Meta.Name} by ${r.Meta.Creator}`} getName={(r) => r.Meta.Name} onSearchChange={setSearch} id={ID} list={data?.levels || []} onDelayedChange={setSearchQuery} setResult={setActiveLevel} status={status} invalid={isInvalid || (required && !activeLevel)} placeholder={defaultData?.Meta.Name} />),
        value: search,
    }
}