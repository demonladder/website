import { useState, useEffect, useEffectEvent } from 'react';
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

    const { data, status } = useQuery({
        queryKey: ['levelSearch', searchQuery],
        queryFn: () => getLevels({ inPack, name: searchQuery, limit: 5, page: 0 }),
    });

    const { data: defaultData } = useQuery({
        queryKey: ['level', defaultLevel],
        queryFn: () => getLevel(defaultLevel!),
        enabled: defaultLevel !== null,
    });

    const onLevelEvent = useEffectEvent(onLevel);
    useEffect(() => {
        if (search === '') onLevelEvent(undefined);
    }, [search]);

    useEffect(() => {
        if (!defaultData?.Meta.Name) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearch(defaultData?.Meta.Name);
    }, [defaultData?.Meta.Name]);

    const clear = () => {
        setSearch('');
        setSearchQuery('');
        onLevel(undefined);
    };

    const handleResult = (level?: SearchLevelResponse) => {
        setSearch(level?.Meta.Name ?? '-');
        onLevel(level);
    };

    return {
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
                onResult={handleResult}
                status={status}
                invalid={isInvalid}
                placeholder={defaultData?.Meta.Name ?? 'Search for a level...'}
                overWriteInput
            />
        ),
        value: search,
    };
}
