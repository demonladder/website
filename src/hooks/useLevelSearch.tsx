import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLevel } from '../features/level/api/getLevel';
import { getLevels, SearchLevelResponse } from '../features/search/api/getLevels';
import SearchBox from '../components/SearchBox/SearchBox';

interface LevelSearchOptions {
    required?: boolean;
    inPack?: boolean;
    defaultLevel?: number | null;
    onLevel?: (level: SearchLevelResponse | undefined) => void;
}

export default function useLevelSearch(
    ID: string,
    { required = false, defaultLevel, inPack, onLevel }: LevelSearchOptions = {},
) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeLevel, setActiveLevel] = useState<Omit<SearchLevelResponse, 'Completed' | 'InPack'>>();
    const [isInvalid, setIsInvalid] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const { data, status } = useQuery({
        queryKey: ['levelSearch', searchQuery],
        queryFn: () => getLevels({ inPack, name: searchQuery, limit: 5, page: 0 }),
    });

    const { data: defaultData } = useQuery({
        queryKey: ['level', defaultLevel],
        queryFn: () => getLevel(defaultLevel ?? null),
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

    function onResult(level?: SearchLevelResponse) {
        setActiveLevel(level);
        onLevel?.(level);
    }

    return {
        activeLevel,
        setQuery,
        clear,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (
            <SearchBox<SearchLevelResponse>
                getLabel={(r) => `${r.Meta.Name} by ${r.Meta.Publisher?.name}`}
                getName={(r) => r.Meta.Name}
                value={search}
                onChange={setSearch}
                onDebouncedChange={setSearchQuery}
                id={ID}
                list={data?.data ?? []}
                onResult={onResult}
                status={status}
                invalid={isInvalid || (required && !activeLevel)}
                placeholder={defaultData?.Meta.Name ?? 'Search for a level...'}
                overWriteInput
            />
        ),
        value: search,
    };
}
