import { useQuery } from '@tanstack/react-query';
import Heading1 from '../../../components/headings/Heading1';
import APIClient from '../../../api/APIClient';
import type Submission from '../../../api/types/Submission';
import PageButtons from '../../../components/shared/PageButtons';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import Checkbox from '../../../components/input/CheckBox';
import { Link } from 'react-router';
import { BooleanParam, NumberParam, useQueryParam, withDefault } from 'use-query-params';

export default function SubmissionSearch() {
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));
    const [extremeDemonReform, setExtremeDemonReform] = useQueryParam('extremeDemonReform', withDefault(BooleanParam, true));

    const flags = extremeDemonReform ? 1 : 0;  // TODO: good luck future me

    const { data } = useQuery({
        queryKey: ['submission-search', { flags, page }],
        queryFn: () => APIClient.get<{ total: number, submissions: Submission[] }>('/submissions', { params: { flags, page } }).then(res => res.data),
    });

    return (
        <div>
            <Heading1>Search submissions</Heading1>
            <div className='my-8'>
                <p><b>Flags</b></p>
                <label className='flex gap-1 items-center'>
                    <Checkbox checked={extremeDemonReform} onChange={e => setExtremeDemonReform(e.target.checked)} />
                    Extreme demon reform
                </label>
            </div>
            {data &&
                <>
                    <ul className='grid grid-cols-4 gap-8'>
                        {data.submissions.map((submission) => (
                            <li key={submission.ID}>
                                <p>Level: <Link to={`/level/${submission.LevelID}`}><span className='float-right font-bold'>{submission.Level?.Meta?.Name ?? '-'}</span></Link></p>
                                <p>Level ID: <span className='float-right font-bold'>{submission.LevelID}</span></p>
                                <p>User: <Link to={`/profile/${submission.UserID}`}><span className='float-right font-bold'>{submission.User?.Name}</span></Link></p>
                                <p className='py-1'>Rating: <span className={`float-right px-2 round:rounded tier-${submission.Rating ?? '0'}`}>{submission.Rating}</span></p>
                                <p className='py-1'>Enjoyment: <span className={`float-right px-2 round:rounded enj-${submission.Enjoyment ?? '-1'}`}>{submission.Enjoyment ?? '-'}</span></p>
                                <p>Proof: <span className='float-right text-right'>{submission.Proof ?? '-'}</span></p>
                                <Link to={`/mod/editSubmission/${submission.ID}`}><SecondaryButton className='w-full'>Edit</SecondaryButton></Link>
                            </li>
                        ))}
                    </ul>
                    <PageButtons page={page} limit={16} total={data.total} onPageChange={setPage} />
                </>
            }
        </div>
    );
}
