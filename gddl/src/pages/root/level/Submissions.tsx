import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetSubmissions, Submission as TSubmission } from '../../../api/submissions';
import { Link } from 'react-router-dom';
import PageButtons from '../../../components/PageButtons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import RefreshRateIcon from './RefreshRateIcon';

type Props = {
    submission: TSubmission,
}

function Submission({ submission }: Props) {
    const enj = submission.Enjoyment == null ? '-1' : submission.Enjoyment;
    const enjText = submission.Enjoyment == null ? 'N/A' : submission.Enjoyment;

    const linkDestination = '/profile/' + submission.UserID;

    const hasWidgets = submission.Proof || submission.Device === 'Mobile';

    const title: string[] = [
        `Sent at: ${new Date(submission.DateAdded + 'z').toLocaleString()}`,
        `Last changed at: ${new Date(submission.DateChanged + 'z').toLocaleString()}`,
        `${submission.RefreshRate}fps`,
    ];

    return (
        <div title={title.join('\n')} className='flex select-none round:rounded-md border border-white border-opacity-0 hover:border-opacity-100 transition-colors'>
            <Link className={'w-1/6 p-2 text-center round:rounded-s-md tier-' + (submission.Rating ? submission.Rating : '0')} to={linkDestination}>{submission.Rating || 'N/A'}</Link>
            <Link className={'w-1/6 p-2 text-center enj-' + enj} to={linkDestination}>{enjText}</Link>
            <Link className='p-2 flex-grow bg-gray-500' to={linkDestination}>{submission.Name}</Link>
            {hasWidgets &&
                <span className='text-lg flex gap-1 items-center bg-gray-500 pe-2'>
                    {submission.Device === 'Mobile' &&
                        <i className='bx bx-mobile-alt' />
                    }
                    {submission.Proof &&
                        <a className='cursor-pointer flex items-center' href={submission.Proof} target='_blank' rel='noopener noreferrer'>
                            <i className='bx bx-link'></i>
                        </a>
                    }
                </span>
            }
            <RefreshRateIcon refreshRate={submission.RefreshRate} />
        </div>
    );
}

export default function Submissions({ levelID }: { levelID: number }) {
    const [page, setPage] = useState(1);
    const { data: submissions, status } = useQuery({
        queryKey: ['level', levelID, 'submissions', { page }],
        queryFn: () => GetSubmissions({ levelID, chunk: 24, page }),
    });

    return (
        <section className='my-4'>
            <h2 className='text-3xl'>Submissions</h2>
            {status === 'loading'
                ? <LoadingSpinner />
                : (submissions === undefined
                    ? <p className='mb-0'>This level does not have any submissions</p>
                    : <>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
                            {submissions.submissions.map(s => <Submission submission={s} key={s.UserID} />)}
                            {submissions.submissions.length === 0 ? <p className='mb-0'>This level does not have any submissions</p> : null}
                        </div>
                        <PageButtons onPageChange={(page) => setPage(page)} meta={{ total: submissions.total, limit: submissions.limit, page }} />
                    </>
                )
            }
        </section>
    );
}