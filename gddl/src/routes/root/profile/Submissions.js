import React, { useState } from 'react';
import Level from './Level';
import { useQuery } from '@tanstack/react-query';
import { GetUserSubmissions } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function Submissions({ userID }) {
    const [page, setPage] = useState(1);

    const { status, data } = useQuery({
        queryKey: ['user/submissions', {userID, page}],
        queryFn: () => GetUserSubmissions(userID, page)
    });

    if (status === 'loading') {
        return (
            <div className='mt-3'>
                <LoadingSpinner />
            </div>
        );
    }

    const submissions = data.submissions;

    return (
        <div className='mt-3'>
            <h1>Submissions [{data.count}]</h1>
            <div className='ratings'>
                <Level info={{ isHeader: true }} />
                {submissions.slice(0, 25).map(p => <Level info={p} key={p.LevelID}/>)}
            </div>
            <div className='mt-3 d-flex gap-3 justify-content-center'>
                <button className='primary' onClick={() => setPage(data.previousPage)}>Previous</button>
                <span>Page {page}</span>
                <button className='primary' onClick={() => setPage(data.nextPage)}>Next</button>
            </div>
        </div>
    );
}