import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import { PackShell } from '../api/packs/types/PackShell';
import { SearchPacks } from '../api/packs/requests/SearchPacks';

interface Props {
    ID: string,
}

interface ListType extends PackShell {
    label: string;
}

export default function usePackSearch({ ID }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activePack, setActivePack] = useState<PackShell>();
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
        SearchBox: (<SearchBox<ListType> search={search} getLabel={(r) => r.Name} getName={(r) => r.Name} onSearchChange={setSearch} id={ID} list={data?.map((d) => ({ ...d, label: d.Name })) || []} onDelayedChange={setSearchQuery} setResult={setActivePack} status={status} invalid={isInvalid} />)
    }
}