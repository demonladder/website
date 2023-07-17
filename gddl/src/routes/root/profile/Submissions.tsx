import React, { useState } from 'react';
import Level from './Level';
import { useQuery } from '@tanstack/react-query';
import { GetUserSubmissions } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';

type Props = {
    userID: number,
}

function Container({ children }: { children: React.ReactNode}) {
    return (
        <div className='mt-3'>
            <h2 className='text-3xl'>Submissions</h2>
            {children}
        </div>
    );
}

export default function Submissions({ userID }: Props) {
    const [page, setPage] = useState(0);

    function pageChange(_page: number) {
        setPage(_page);
    }

    const { status, data } = useQuery({
        queryKey: ['user/submissions', {userID, page}],
        queryFn: () => GetUserSubmissions(userID, page+1),
    });

    if (status === 'loading') {
        return (
            <Container>
                <LoadingSpinner />
            </Container>
        );
    }

    const submissions = data?.submissions;

    if (submissions === undefined || data === undefined || submissions.length === 0) {
        return <></>;
    }

    return (
        <Container>
            <div className='level-list'>
                <Level isHeader={true} />
                {submissions.slice(0, 25).map((p) => <Level isHeader={false} info={p} key={p.LevelID}/>)}
            </div>
            <PageButtons onPageChange={pageChange} meta={{...data, page }} />
        </Container>
    );
}