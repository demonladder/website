import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLevel } from '../features/level/api/getLevel';
import { getLevels, SearchLevelResponse } from '../features/search/api/getLevels';
import SearchBox from '../components/SearchBox/SearchBox';

interface LevelSearchOptions {
    defaultLevel?: number | null;
    inPack?: boolean;
    isInvalid?: boolean;
    onLevel: (level: SearchLevelResponse | undefined) => void;
}

export default function useLevelSearch(ID: string, { defaultLevel, inPack, isInvalid, onLevel }: LevelSearchOptions) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const ref = useRef<HTMLInputElement>(null);

    const { data, status } = useQuery({
        queryKey: ['levelSearch', searchQuery],
        queryFn: () => getLevels({ inPack, name: searchQuery, limit: 5, page: 0 }),
    });

    const { data: defaultData } = useQuery({
        queryKey: ['level', defaultLevel],
        queryFn: () => getLevel(defaultLevel!),
        enabled: defaultLevel !== null,
    });

    useEffect(() => {
        if (search === '') onLevel(undefined);
    }, [search]);

    useEffect(() => {
        if (!defaultData) return;

        if (ref.current) ref.current.value = defaultData?.Meta.Name;
        setSearch(defaultData?.Meta.Name);
    }, [defaultData]);

    function clear() {
        setSearch('');
        setSearchQuery('');
        onLevel(undefined);
    }

    function setText(query: string) {
        setSearch(query);
        setSearchQuery(query);
    }

    function onResult(level?: SearchLevelResponse) {
        setSearch(level?.Meta.Name ?? '-');
        onLevel(level);
    }

    return {
        setText,
        clear,
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
                invalid={isInvalid}
                placeholder={defaultData?.Meta.Name ?? 'Search for a level...'}
                overWriteInput
            />
        ),
        value: search,
    };
}
