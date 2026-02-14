import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import SearchPacks from '../api/packs/requests/SearchPacks';
import Pack from '../features/singlePack/types/Pack';

interface Props {
    ID: string;
}

interface ListType extends Pack {
    label: string;
}

export default function usePackSearch({ ID }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activePack, setActivePack] = useState<Pack>();
    const [isInvalid, setIsInvalid] = useState(false);

    const { data, status } = useQuery({
        queryKey: ['packSearch', searchQuery],
        queryFn: () => SearchPacks(searchQuery),
    });

    useEffect(() => {
        setIsInvalid(false);
    }, [search, activePack]);

    return {
        activePack,
        searchQuery: search,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (
            <SearchBox<ListType>
                getLabel={(r) => r.Name}
                getName={(r) => r.Name}
                value={search}
                onChange={setSearch}
                onDebouncedChange={setSearchQuery}
                id={ID}
                list={data?.map((d) => ({ ...d, label: d.Name })) || []}
                onResult={setActivePack}
                status={status}
                invalid={isInvalid}
            />
        ),
    };
}
