import { useState } from 'react';
import Level from './Level';
import { useQuery } from '@tanstack/react-query';
import { GetUserSubmissions } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';
import SortMenu from './SortMenu';

type Props = {
    userID: number,
}

export default function Submissions({ userID }: Props) {
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState<{ sort: string, sortDirection: string}>({ sort: 'LevelID', sortDirection: 'asc'});

    function pageChange(_page: number) {
        setPage(_page);
    }

    const { status, data } = useQuery({
        queryKey: ['user/submissions', { userID, page, ...sort }],
        queryFn: () => GetUserSubmissions({ userID, page: page+1, ...sort }),
    });

    if (status === 'loading') {
        return (
            <LoadingSpinner />
        );
    }

    const submissions = data?.submissions;

    if (submissions === undefined || data === undefined || submissions.length === 0) {
        return <></>;
    }

    return (
        <div className='mt-3'>
            <div className='flex items-center gap-2'>
                <h2 className='text-3xl'>Submissions</h2>
                <SortMenu set={setSort} />
            </div>
            <div className='level-list'>
                <Level isHeader={true} />
                {submissions.slice(0, 25).map((p) => <Level isHeader={false} info={p} key={p.LevelID}/>)}
            </div>
            <PageButtons onPageChange={pageChange} meta={{...data, page }} />
        </div>
    );
}