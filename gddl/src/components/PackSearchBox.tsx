import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchPacks } from '../api/packs';
import SearchBox from './SearchBox/SearchBox';

type Props = {
    setResult: (e: any) => void,
    id: string,
}

export default function PackSearchBox({ setResult, id }: Props) {
    const [search, setSearch] = useState('');

    const { status, data } = useQuery({
        queryKey: ['packSearch', search],
        queryFn: () => SearchPacks(search)
    });

    const update = (search: string) => {
        setSearch(search);
    }

    if (data === undefined) return <></>;
    return <SearchBox id={id} list={data.packs.map((d) => {return {...d, label: d.Name}})} update={update} setResult={setResult} status={status} />
}