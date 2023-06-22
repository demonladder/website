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
            <h1>Submissions</h1>
            {children}
        </div>
    );
}

export default function Submissions({ userID }: Props) {
    const [page, setPage] = useState(1);

    function pageChange(_page: number) {
        setPage(_page);
    }

    const { status, data, fetchStatus } = useQuery({
        queryKey: ['user/submissions', {userID, page}],
        queryFn: () => GetUserSubmissions(userID, page),
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
            <div className='ratings'>
                <Level isHeader={true} />
                {submissions.slice(0, 25).map((p) => <Level isHeader={false} info={p} key={p.LevelID}/>)}
            </div>
            <PageButtons onPageChange={pageChange} page={page} meta={data} loadingState={fetchStatus} />
        </Container>
    );
}