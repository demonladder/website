import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetSubmissions, Submission as TSubmission } from '../../../api/submissions';
import { Link } from 'react-router-dom';
import PageButtons from '../../../components/PageButtons';
import LoadingSpinner from '../../../components/LoadingSpinner';

type Props = {
    submission: TSubmission,
}

function Submission({ submission }: Props) {
    const enj = submission.Enjoyment == null ? '-1' : submission.Enjoyment;
    const enjText = submission.Enjoyment == null ? 'N/A' : submission.Enjoyment;
    return (
        <Link className='flex bg-gray-500 select-none hover:-translate-y-1 transition-transform' to={'/profile/' + submission.UserID}>
            <p className={'w-1/6 p-2 text-center tier-' + (submission.Rating ? submission.Rating : '0')}>{submission.Rating || 'N/A'}</p>
            <p className={'w-1/6 p-2 text-center enj-' + enj}>{enjText}</p>
            <div className='p-2'>{submission.Name}</div>
        </Link>
    );
}

export default function Submissions({ levelID }: { levelID: number }) {
    const [page, setPage] = useState(0);
    const { data: submissions, status } = useQuery({
        queryKey: ['submissions', { levelID, page }],
        queryFn: () => GetSubmissions({ levelID, chunk: 24, page: page+1 }),
    });

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (submissions === undefined) {
        return <p className='mb-0'>This level does not have any submissions</p>
    }

    return (
        <div className='my-4'>
            <h2 className='text-3xl'>Submissions</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
                {submissions.submissions.map(s => <Submission submission={s} key={s.UserID} />)}
                {submissions.submissions.length === 0 ? <p className='mb-0'>This level does not have any submissions</p> : null}
            </div>
            <PageButtons onPageChange={(page) => setPage(page)} meta={{ total: submissions.total, limit: submissions.limit, page }} />
        </div>
    );
}