import { useState } from 'react';
import { getLevels, type SearchLevelResponse } from '../../features/search/api/getLevels';
import SearchBox from './SearchBox';
import { useQuery } from '@tanstack/react-query';

interface Props {
    ID: string;
    onLevel: (level: SearchLevelResponse | undefined) => void;
}

export default function LevelSearchBox({ ID, onLevel }: Props) {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { data, status } = useQuery({
        queryKey: ['levelSearch', debouncedSearch],
        queryFn: () => getLevels({ name: debouncedSearch, limit: 5, page: 0 }),
    });

    return (
        <SearchBox<SearchLevelResponse>
            id={ID}
            onResult={onLevel}
            value={search}
            onChange={setSearch}
            onDebouncedChange={setDebouncedSearch}

            list={data?.levels ?? []}
            getLabel={(r) => `${r.Meta.Name} by ${r.Meta.Publisher?.name}`}
            getName={(r) => r.Meta.Name}

            status={status}
            placeholder={'Search level name'}
            overWriteInput
        />
    );
}
