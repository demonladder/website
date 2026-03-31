import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import SearchPacks from '../api/packs/requests/SearchPacks';
import Pack from '../features/singlePack/types/Pack';

interface Props {
    ID: string;
    onPack: (pack: Pack | undefined) => void;
}

interface ListType extends Pack {
    label: string;
}

export default function usePackSearch({ ID, onPack }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data, status } = useQuery({
        queryKey: ['packSearch', searchQuery],
        queryFn: () => SearchPacks(searchQuery),
    });

    return {
        searchQuery: search,
        SearchBox: (
            <SearchBox<ListType>
                getLabel={(r) => r.Name}
                getName={(r) => r.Name}
                value={search}
                onChange={setSearch}
                onDebouncedChange={setSearchQuery}
                id={ID}
                list={data?.map((d) => ({ ...d, label: d.Name })) || []}
                onResult={onPack}
                status={status}
            />
        ),
    };
}
