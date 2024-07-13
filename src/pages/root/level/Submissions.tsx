import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import PageButtons from '../../../components/PageButtons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import RefreshRateIcon from './RefreshRateIcon';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import GetLevelSubmissions, { Submission as ISubmission } from '../../../api/submissions/GetLevelSubmissions';

type Props = {
    submission: ISubmission,
}

function Submission({ submission }: Props) {
    const enj = submission.Enjoyment == null ? '-1' : submission.Enjoyment;
    const enjText = submission.Enjoyment == null ? '-' : submission.Enjoyment;

    const linkDestination = '/profile/' + submission.UserID;

    const hasWidgets = submission.Proof || submission.Device === 'Mobile';

    const title: string[] = [];
    title.push(`Sent at: ${new Date(submission.DateAdded).toLocaleString()}`);
    title.push(`Last changed at: ${new Date(submission.DateChanged).toLocaleString()}`);
    title.push(`${submission.RefreshRate}fps`);
    if (submission.Device === 'Mobile') title.push('Completed on mobile');

    return (
        <div title={title.join('\n')} className='text-sm lg:text-lg flex select-none round:rounded-md border border-white border-opacity-0 hover:border-opacity-100 transition-colors'>
            <Link className={'w-[40px] lg:w-1/6 p-2 text-center round:rounded-s-md tier-' + (submission.Rating ? submission.Rating : '0')} to={linkDestination}>{submission.Rating || '-'}</Link>
            <Link className={'w-[40px] lg:w-1/6 p-2 text-center enj-' + enj} to={linkDestination}>{enjText}</Link>
            <Link className='p-2 flex-grow bg-gray-500' to={linkDestination}>{submission.User.Name}</Link>
            {hasWidgets &&
                <span className='flex gap-1 items-center bg-gray-500 pe-2'>
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

export default function Submissions({ level }: { level: FullLevel }) {
    const [page, setPage] = useState(1);
    const { data: submissions, status } = useQuery({
        queryKey: ['level', level.ID, 'submissions', { page }],
        queryFn: () => GetLevelSubmissions({ levelID: level.ID, chunk: 24, page }),
    });

    return (
        <section className='mt-6'>
            <h2 className='text-3xl'>{level.SubmissionCount} Submission{level.SubmissionCount !== 1 ? 's' : ''}</h2>
            <div>
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
            </div>
        </section>
    );
}