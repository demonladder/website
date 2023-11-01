import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PackShell, SearchPacks } from '../api/packs';
import SearchBox from './SearchBox/SearchBox';

type Props = {
    setResult: (e: PackShell | undefined) => void,
    id: string,
}

interface ListType extends PackShell {
    label: string;
}

export default function PackSearchBox({ setResult, id }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { status, data } = useQuery({
        queryKey: ['packSearch', searchQuery],
        queryFn: () => SearchPacks(searchQuery)
    });

    if (data === undefined) return;
    return <SearchBox<ListType> search={search} onSearchChange={setSearch} id={id} list={data.map((d) => ({ ...d, label: d.Name }))} onDelayedChange={setSearchQuery} setResult={setResult} status={status} />
}