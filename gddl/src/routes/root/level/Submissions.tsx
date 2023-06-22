import * as React from 'react';
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
        <div className='submission-ref'>
            <p className={'rating tier-' + (submission.Rating ? submission.Rating : '0')}>{submission.Rating || 'N/A'}</p>
            <p className={'enjoyment enj-' + enj}>{enjText}</p>
            <Link className='name' to={'/profile/' + submission.UserID}>{submission.Name}</Link>
        </div>
    );
}

export default function Submissions({ levelID }: { levelID: number }) {
    const [page, setPage] = React.useState(1);
    const { data: submissions, status } = useQuery({
        queryKey: ['submissions', { levelID, page }],
        queryFn: () => GetSubmissions({ levelID, chunk: 24, page }),
    });

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (submissions === undefined) {
        return <p className='mb-0'>This level does not have any submissions</p>
    }

    return (
        <div>
            <div className='submission-wrapper'>
                {submissions.submissions.map(s => <Submission submission={s} key={s.UserID} />)}
                {submissions.submissions.length === 0 ? <p className='mb-0'>This level does not have any submissions</p> : null}
            </div>
            <PageButtons onPageChange={(page) => setPage(page)} page={page} meta={{ nextPage: submissions.nextPage, pages: submissions.pages, previousPage: submissions.previousPage }} loadingState={status} />
        </div>
    );
}