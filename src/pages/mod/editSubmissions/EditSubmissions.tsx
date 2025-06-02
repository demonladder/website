import { useEffect } from 'react';
import { TextInput } from '../../../components/Input';
import { useQuery } from '@tanstack/react-query';
import PageButtons from '../../../components/PageButtons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useLevelSearch from '../../../hooks/useLevelSearch';
import Submission from '../../../api/types/Submission';
import { getLevelSubmissions } from '../../../features/level/api/getLevelSubmissions';
import useLateValue from '../../../hooks/useLateValue';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import EditableSubmission from './EditableSubmission';
import { useSubmission } from '../../../components/modals/useSubmission';

export default function EditSubmission() {
    const [levelID, setLevelID] = useQueryParam('levelID', NumberParam);
    const [userID, setUserID] = useQueryParam('userID', NumberParam);

    const { activeLevel, SearchBox } = useLevelSearch({ ID: 'addSubmissionSearch', options: { defaultLevel: levelID } });
    const [usernameFilter, lateUsernameFilter, setUsernameFilter] = useLateValue('');

    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));

    const { status, data } = useQuery({
        queryKey: ['level', activeLevel?.ID, 'submissions', { page, username: lateUsernameFilter, progressFilterKey: 'all' }],
        queryFn: () => getLevelSubmissions({ levelID: activeLevel?.ID || 0, limit: 24, page, username: lateUsernameFilter, progressFilter: 'all' }),
    });

    const { data: submission } = useSubmission(levelID ?? 0, userID ?? 0, {
        enabled: userID !== undefined && levelID !== undefined,
    });

    useEffect(() => {
        setPage(0);
        setLevelID(activeLevel?.ID);
        setUserID(undefined);
    }, [activeLevel, setLevelID, setUserID]);

    function submissionClicked(s: Submission) {
        setUserID(s.UserID);
    }

    if (status === 'loading') return (<LoadingSpinner />);
    if (status === 'error') return 'An error occurred';

    return (
        <main>
            <h3 className='text-2xl mb-3'>Edit Submission</h3>
            <div className='flex flex-col gap-4'>
                <div>
                    <FormInputLabel htmlFor='addSubmissionSearch'>Level:</FormInputLabel>
                    {SearchBox}
                </div>
                <div>
                    <p className='font-bold'>Submission list</p>
                    <TextInput value={usernameFilter} onChange={(e) => setUsernameFilter(e.target.value)} placeholder='Filter by user name...' />
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2'>
                        {data?.submissions.map((s) => (
                            <button className={'flex ps-1 border border-white/0 hover:border-white/80 transition-colors select-none round:rounded ' + (s.UserID === userID ? 'bg-button-primary-1 font-bold' : 'bg-theme-600')} onClick={() => submissionClicked(s)} key={`edit_${s.UserID}_${s.LevelID}`}>
                                <p className='grow text-start self-center'>{s.User.Name}</p>
                                <p className={`w-8 py-1 tier-${s.Rating !== null ? Math.round(s.Rating) : 0}`}>{s.Rating || '-'}</p>
                                <p className={`w-8 py-1 enj-${s.Enjoyment !== null ? Math.round(s.Enjoyment) : -1}`}>{s.Enjoyment !== null ? s.Enjoyment : '-'}</p>
                            </button>
                        ))}
                        {data === undefined && <p>Select a level first</p>}
                        {data.submissions.length === 0 && <p>No submissions</p>}
                    </div>
                    <PageButtons meta={data} onPageChange={setPage} />
                </div>
                {submission &&
                    <EditableSubmission submission={submission} key={`${submission.LevelID}_${submission.UserID}`} />
                }
            </div>
        </main>
    );
}
