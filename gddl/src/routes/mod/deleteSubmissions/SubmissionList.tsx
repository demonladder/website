import React, { useState } from 'react';
import { GetSubmissions } from '../../../api/submissions';
import Submission from './Submission';
import PageButtons from '../../../components/PageButtons';
import { useQuery } from '@tanstack/react-query';

type Props = {
    levelID: number,
}

export default function SubmissionList({ levelID }: Props) {
    const [page, setPage] = useState(1);

    const { data: submissionInfo } = useQuery({
        queryKey: ['submissions', {levelID, page}],
        queryFn: () => GetSubmissions({levelID, page, chunk: 10}),
    });

    if (submissionInfo === undefined || levelID === 0) {
        return (<></>);
    }

    return (
        <div>
            <p className='m-0'>Submissions:</p>
            <div id='submissionList'>
                {submissionInfo.submissions.map((sub) => <Submission submission={sub} levelID={levelID} />)}
            </div>
            <PageButtons onPageChange={(_page) => setPage(_page)} page={page} meta={{ nextPage: submissionInfo.nextPage, previousPage: submissionInfo.previousPage, pages: submissionInfo.pages }} />
        </div>
    );
}