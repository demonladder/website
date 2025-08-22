import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sorts, UserSubmission, getUserSubmissions } from '../api/getUserSubmissions';
import PageButtons from '../../../components/PageButtons';
import SortMenu from './SortMenu';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { GridLevel } from '../../../components/GridLevel';
import Level, { LevelSkeleton } from '../../../components/Level';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { TextInput } from '../../../components/Input';
import { useNavigate } from 'react-router';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import useLateValue from '../../../hooks/useLateValue';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useDeleteSubmissionModal from '../../../hooks/modals/useDeleteSubmissionModal';
import User from '../../../api/types/User';
import Heading2 from '../../../components/headings/Heading2';
import SegmentedButtonGroup from '../../../components/input/buttons/segmented/SegmentedButtonGroup';
import { PermissionFlags } from '../../admin/roles/PermissionFlags';
import useSubmitModal from '../../../hooks/modals/useSubmitModal';
import useSession from '../../../hooks/useSession';
import { copyText } from '../../../utils/copyText';

interface Props {
    user: User;
}

const viewOptions = {
    inline: 'Inline',
    grid: 'Grid',
} as const;
type ViewOption = keyof typeof viewOptions;

export default function Submissions({ user }: Props) {
    const [page, setPage] = useSessionStorage(`profilePageIndex_${user.ID}`, 0);
    const [sort, setSort] = useState<{ sort: Sorts, sortDirection: string }>({ sort: Sorts.LEVEL_ID, sortDirection: 'asc' });
    const [listType, setListType] = useLocalStorage<ViewOption>('profile.listType', 'grid');
    const [query, lateQuery, setQuery] = useLateValue('', 500);
    const [onlyIncomplete, setOnlyIncomplete] = useState(false);

    const { status, data: submissionResult } = useQuery({
        queryKey: ['user', user.ID, 'submissions', { page, name: lateQuery, onlyIncomplete, ...sort }],
        queryFn: () => getUserSubmissions({ userID: user.ID, page, name: lateQuery, onlyIncomplete, ...sort }),
    });

    useEffect(() => {
        if (submissionResult?.total !== 0 && submissionResult?.submissions.length === 0) setPage(0);
    }, [submissionResult, setPage]);

    return (
        <section className='mt-6'>
            <div className='flex justify-between'>
                <Heading2 id='submissions'>Submissions</Heading2>
                <SegmentedButtonGroup options={viewOptions} activeKey={listType} onSetActive={(o) => setListType(o)} />
            </div>
            <div className='flex items-center gap-2 mb-2 flex-wrap'>
                <div className='max-md:w-full md:w-60'>
                    <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Filter by name...' />
                </div>
                <SortMenu set={setSort} />
                <button className={'w-7 h-7 grid place-items-center text-black ' + (onlyIncomplete ? 'bg-theme-950 text-white' : 'bg-white')} onClick={() => setOnlyIncomplete((prev) => !prev)}>
                    <span><b>%</b></span>
                </button>
            </div>
            {status === 'pending' && Array.from({ length: 16 }).map((_, i) => <LevelSkeleton key={i} />)}
            {status === 'success' && <>
                {listType === 'inline' ?
                    <InlineList levels={submissionResult.submissions} user={user} /> :
                    <GridList levels={submissionResult.submissions} user={user} />
                }
                {submissionResult.submissions.length === 0 &&
                    <p>No levels</p>
                }
                <PageButtons onPageChange={setPage} meta={{ ...submissionResult, page }} />
            </>}
        </section>
    );
}

function InlineList({ levels, user }: { levels: (UserSubmission)[], user: User }) {
    const openAddListLevelModal = useAddListLevelModal();
    const openDeleteSubmissionModal = useDeleteSubmissionModal();
    const openSubmitModal = useSubmitModal();
    const session = useSession();

    const navigate = useNavigate();

    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Go to level', onClick: () => navigate(`/level/${submission.Level.ID}`) },
                { text: 'Add to list', onClick: () => openAddListLevelModal(session.user!.ID, submission.Level.ID), requireSession: true },
                { type: 'divider' },
                { text: 'Copy level ID', onClick: () => copyText(submission.Level.ID.toString()), icon: <i className='bx bx-clipboard' /> },
                { text: 'Copy submission ID', onClick: () => copyText(submission.ID.toString()), icon: <i className='bx bx-clipboard' /> },
                { type: 'divider' },
                { text: 'View proof', onClick: () => window.open(submission.Proof!, '_blank'), disabled: !submission.Proof, icon: <i className='bx bx-link-external' /> },
                { text: 'Edit', userID: user.ID, onClick: () => openSubmitModal(submission.Level) },
                { text: 'Edit (staff)', onClick: () => navigate(`/mod/editSubmission/${submission.ID}`), permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Delete', type: 'danger', userID: user.ID, permission: PermissionFlags.MANAGE_SUBMISSIONS, onClick: () => openDeleteSubmissionModal(user.ID, submission.Level.ID, submission.ID, user.Name), icon: <i className='bx bx-trash' /> },
            ],
        });
    }

    return (
        <ul>
            {levels.map((p) => (
                <li key={p.Level.ID}>
                    <Level ID={p.Level.ID} difficulty={p.Level.Meta.Difficulty} rarity={p.Level.Meta.Rarity} rating={p.Rating} actualRating={p.Level.Rating} enjoyment={p.Enjoyment} actualEnjoyment={p.Level.Enjoyment} name={p.Level.Meta.Name} creator={p.Level.Meta.Publisher?.name} songName={p.Level.Meta.Song.Name} onContextMenu={(e) => openContext(e, p)} />
                </li>
            ))}
        </ul>
    );
}

function GridList({ levels, user }: { levels: UserSubmission[], user: User }) {
    const openAddListLevelModal = useAddListLevelModal();
    const openDeleteSubmissionModal = useDeleteSubmissionModal();
    const openSubmitModal = useSubmitModal();
    const session = useSession();

    const navigate = useNavigate();

    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Go to level', onClick: () => navigate(`/level/${submission.Level.ID}`) },
                { text: 'Add to list', onClick: () => openAddListLevelModal(session.user!.ID, submission.Level.ID), requireSession: true },
                { type: 'divider' },
                { text: 'Copy level ID', onClick: () => copyText(submission.Level.ID.toString()), icon: <i className='bx bx-clipboard' /> },
                { text: 'Copy submission ID', onClick: () => copyText(submission.ID.toString()), icon: <i className='bx bx-clipboard' /> },
                { type: 'divider' },
                { text: 'View proof', onClick: () => window.open(submission.Proof!, '_blank'), disabled: !submission.Proof, icon: <i className='bx bx-link-external' /> },
                { text: 'Edit', userID: user.ID, onClick: () => openSubmitModal(submission.Level) },
                { text: 'Edit (staff)', onClick: () => navigate(`/mod/editSubmission/${submission.ID}`), permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Delete', type: 'danger', userID: user.ID, permission: PermissionFlags.MANAGE_SUBMISSIONS, onClick: () => openDeleteSubmissionModal(user.ID, submission.Level.ID, submission.ID, user.Name), icon: <i className='bx bx-trash' /> },
            ],
        });
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {levels.map((p) => <GridLevel ID={p.Level.ID} rating={p.Rating} enjoyment={p.Enjoyment} proof={p.Proof} name={p.Level.Meta.Name} creator={p.Level.Meta.Publisher?.name} difficulty={p.Level.Meta.Difficulty} rarity={p.Level.Meta.Rarity} inPack={false} onContextMenu={(e) => openContext(e, p)} key={p.Level.ID} />)}
        </div>
    );
}
