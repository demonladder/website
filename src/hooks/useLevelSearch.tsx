import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLevel } from '../features/level/api/getLevel';
import { getLevels, SearchLevelResponse } from '../features/search/api/getLevels';
import SearchBox from '../components/SearchBox/SearchBox';

interface LevelSearchOptions {
    inPack?: boolean;
    defaultLevel?: number | null;
}

interface Props {
    ID: string,
    required?: boolean;
    options?: LevelSearchOptions,
}

export default function useLevelSearch({ ID, required = false, options = {} }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeLevel, setActiveLevel] = useState<Omit<SearchLevelResponse, 'Completed' | 'InPack'>>();
    const [isInvalid, setIsInvalid] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const { data, status } = useQuery({
        queryKey: ['levelSearch', searchQuery],
        queryFn: () => getLevels({ ...options, name: searchQuery, limit: 5, page: 0 }),
    });

    const { data: defaultData } = useQuery({
        queryKey: ['level', options.defaultLevel],
        queryFn: () => getLevel(options.defaultLevel || null),
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
        SearchBox: (<SearchBox<SearchLevelResponse> search={search} getLabel={(r) => `${r.Meta.Name} by ${r.Meta.Publisher?.name}`} getName={(r) => r.Meta.Name} onSearchChange={setSearch} id={ID} list={data?.levels ?? []} onDelayedChange={setSearchQuery} setResult={setActiveLevel} status={status} invalid={isInvalid || (required && !activeLevel)} placeholder={defaultData?.Meta.Name} />),
        value: search,
    };
}
