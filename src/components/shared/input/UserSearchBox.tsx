import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TinyUser } from '../../../api/types/TinyUser';
import SearchBox from '../../SearchBox/SearchBox';
import { searchUsers } from '../../../api/user/searchUsers';

interface Props {
    setResult: (e: TinyUser | undefined) => void;
    id: string;
    invalid?: boolean;
}

interface UserType extends TinyUser {
    label: string;
}

export default function UserSearchBox({ setResult, id, invalid = false }: Props) {
    const [text, setText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { status, data } = useQuery({
        queryKey: ['userSearch', searchQuery],
        queryFn: () => searchUsers({ name: searchQuery }),
    });

    return (
        <SearchBox<UserType>
            getLabel={(r) => r.Name}
            getName={(r) => r.Name}
            value={text}
            onChange={setText}
            onDebouncedChange={setSearchQuery}
            id={id}
            list={data?.data.map((d) => ({ ...d, label: d.Name })) ?? []}
            onResult={setResult}
            status={status}
            placeholder='Search user...'
            invalid={invalid}
            overWriteInput
        />
    );
}
