import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sorts, UserSubmission, getUserSubmissions } from '../api/getUserSubmissions';
import PageButtons from '../../../components/shared/PageButtons';
import SortMenu from './SortMenu';
import { GridLevel } from '../../../components/shared/GridLevel';
import Level, { LevelSkeleton } from '../../../components/shared/Level';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { TextInput } from '../../../components/shared/input/Input';
import useContextMenu from '../../../context/menu/useContextMenu';
import useLateValue from '../../../hooks/useLateValue';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useDeleteSubmissionModal from '../../../hooks/modals/useDeleteSubmissionModal';
import User from '../../../api/types/User';
import { Heading2 } from '../../../components/headings';
import { PermissionFlags } from '../../admin/roles/PermissionFlags';
import useSubmitModal from '../../../hooks/modals/useSubmitModal';
import useSession from '../../../hooks/useSession';
import { copyText } from '../../../utils/copyText';
import { useApp } from '../../../context/app/useApp';
import { LevelViewType } from '../../../context/app/AppContext';
import SegmentedButtonGroup from '../../../components/input/buttons/segmented/SegmentedButtonGroup';
import type { SubmissionStatus } from '../api/getUserPendingSubmissions';
import Select from '../../../components/input/select/Select';
import { useStatusCounts } from '../hooks/useStatusCounts';

interface Props {
    user: User;
}

export default function Submissions({ user }: Props) {
    const [page, setPage] = useSessionStorage(`profilePageIndex_${user.ID}`, 0);
    const [sort, setSort] = useState<{ sort: Sorts; sortDirection: string }>({
        sort: Sorts.LEVEL_ID,
        sortDirection: 'asc',
    });
    const app = useApp();
    const [query, lateQuery, setQuery] = useLateValue('', 500);
    const [statusOptionsKey, setStatusOptionsKey] = useState<SubmissionStatus | 'all'>('beaten');

    const { data: statusCounts } = useStatusCounts(user.ID);

    const statusOptions: Record<SubmissionStatus | 'all', string> = {
        all: 'All' + (statusCounts ? ` (${Object.values(statusCounts).reduce((acc, cur) => acc + cur, 0)})` : ''),
        beaten: 'Completed' + (statusCounts ? ` (${statusCounts.beaten})` : ''),
        beating: 'In progress' + (statusCounts ? ` (${statusCounts.beating})` : ''),
        dropped: 'Dropped' + (statusCounts ? ` (${statusCounts.dropped})` : ''),
        hold: 'On hold' + (statusCounts ? ` (${statusCounts.hold})` : ''),
        ptb: 'Plan to beat' + (statusCounts ? ` (${statusCounts.ptb})` : ''),
    };

    const { status, data: submissionResult } = useQuery({
        queryKey: ['user', user.ID, 'submissions', { page, name: lateQuery, status: statusOptionsKey, ...sort }],
        queryFn: () =>
            getUserSubmissions({
                userID: user.ID,
                page,
                name: lateQuery,
                status: statusOptionsKey !== 'all' ? statusOptionsKey : undefined,
                ...sort,
            }),
    });

    useEffect(() => {
        if (submissionResult?.total !== 0 && submissionResult?.submissions.length === 0) setPage(0);
    }, [submissionResult, setPage]);

    return (
        <section className='mt-6'>
            <Heading2 id='submissions'>Submissions</Heading2>
            <div className='flex items-center gap-2 mb-2 flex-wrap'>
                <div className='max-md:w-full md:w-60'>
                    <TextInput
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Filter by name...'
                    />
                </div>
                <SortMenu set={setSort} />
                <div className='lg:hidden'>
                    <Select
                        label={'Status'}
                        options={statusOptions}
                        key={statusOptionsKey}
                        onOption={(key) => setStatusOptionsKey(key as SubmissionStatus | 'all')}
                        id='profileSubmissionsStatusSelect'
                    />
                </div>
                <div className='grow max-lg:hidden'>
                    <SegmentedButtonGroup
                        options={statusOptions}
                        activeKey={statusOptionsKey}
                        onSetActive={setStatusOptionsKey}
                    />
                </div>
            </div>
            {status === 'pending' && Array.from({ length: 16 }).map((_, i) => <LevelSkeleton key={i} />)}
            {status === 'success' && (
                <>
                    {app.levelViewType === LevelViewType.LIST ? (
                        <InlineList levels={submissionResult.submissions} user={user} />
                    ) : (
                        <GridList levels={submissionResult.submissions} user={user} />
                    )}
                    {submissionResult.submissions.length === 0 && <p>No submissions</p>}
                    <PageButtons
                        onPageChange={setPage}
                        page={page}
                        limit={submissionResult.limit}
                        total={submissionResult.total}
                    />
                </>
            )}
        </section>
    );
}

function InlineList({ levels, user }: { levels: UserSubmission[]; user: User }) {
    const openAddListLevelModal = useAddListLevelModal();
    const openDeleteSubmissionModal = useDeleteSubmissionModal();
    const openSubmitModal = useSubmitModal();
    const session = useSession();

    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Go to level', to: `/level/${submission.Level.ID}` },
                {
                    text: 'Add to list',
                    onClick: () => openAddListLevelModal(session.user!.ID, submission.Level.ID),
                    requireSession: true,
                },
                { type: 'divider' },
                {
                    text: 'Copy level ID',
                    onClick: () => copyText(submission.Level.ID.toString()),
                    icon: <i className='bx bx-clipboard' />,
                },
                {
                    text: 'Copy submission ID',
                    onClick: () => copyText(submission.ID.toString()),
                    icon: <i className='bx bx-clipboard' />,
                },
                { type: 'divider' },
                {
                    text: 'View proof',
                    onClick: () => window.open(submission.Proof!, '_blank'),
                    disabled: !submission.Proof,
                    icon: <i className='bx bx-link-external' />,
                },
                { text: 'Edit', userID: user.ID, onClick: () => openSubmitModal(submission.Level) },
                {
                    text: 'Edit (staff)',
                    to: `/mod/editSubmission/${submission.ID}`,
                    permission: PermissionFlags.MANAGE_SUBMISSIONS,
                },
                {
                    text: 'Delete',
                    type: 'danger',
                    userID: user.ID,
                    permission: PermissionFlags.MANAGE_SUBMISSIONS,
                    onClick: () => openDeleteSubmissionModal(user.ID, submission.Level.ID, submission.ID, user.Name),
                    icon: <i className='bx bx-trash' />,
                },
            ],
        });
    }

    return (
        <ul>
            {levels.map((p) => (
                <li key={p.Level.ID}>
                    <Level
                        ID={p.Level.ID}
                        difficulty={p.Level.Meta.Difficulty}
                        rarity={p.Level.Meta.Rarity}
                        rating={p.Rating}
                        actualRating={p.Level.Rating}
                        enjoyment={p.Enjoyment}
                        actualEnjoyment={p.Level.Enjoyment}
                        name={p.Level.Meta.Name}
                        creator={p.Level.Meta.Publisher?.name}
                        songName={p.Level.Meta.Song.Name}
                        onContextMenu={(e) => openContext(e, p)}
                    />
                </li>
            ))}
        </ul>
    );
}

function GridList({ levels, user }: { levels: UserSubmission[]; user: User }) {
    const openAddListLevelModal = useAddListLevelModal();
    const openDeleteSubmissionModal = useDeleteSubmissionModal();
    const openSubmitModal = useSubmitModal();
    const session = useSession();

    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Go to level', to: `/level/${submission.Level.ID}` },
                {
                    text: 'Add to list',
                    onClick: () => openAddListLevelModal(session.user!.ID, submission.Level.ID),
                    requireSession: true,
                },
                { type: 'divider' },
                {
                    text: 'Copy level ID',
                    onClick: () => copyText(submission.Level.ID.toString()),
                    icon: <i className='bx bx-clipboard' />,
                },
                {
                    text: 'Copy submission ID',
                    onClick: () => copyText(submission.ID.toString()),
                    icon: <i className='bx bx-clipboard' />,
                },
                { type: 'divider' },
                {
                    text: 'View proof',
                    onClick: () => window.open(submission.Proof!, '_blank'),
                    disabled: !submission.Proof,
                    icon: <i className='bx bx-link-external' />,
                },
                { text: 'Edit', userID: user.ID, onClick: () => openSubmitModal(submission.Level) },
                {
                    text: 'Edit (staff)',
                    to: `/mod/editSubmission/${submission.ID}`,
                    permission: PermissionFlags.MANAGE_SUBMISSIONS,
                },
                {
                    text: 'Delete',
                    type: 'danger',
                    userID: user.ID,
                    permission: PermissionFlags.MANAGE_SUBMISSIONS,
                    onClick: () => openDeleteSubmissionModal(user.ID, submission.Level.ID, submission.ID, user.Name),
                    icon: <i className='bx bx-trash' />,
                },
            ],
        });
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {levels.map((p) => (
                <GridLevel
                    ID={p.Level.ID}
                    rating={p.Rating}
                    enjoyment={p.Enjoyment}
                    proof={p.Proof}
                    name={p.Level.Meta.Name}
                    creator={p.Level.Meta.Publisher?.name}
                    difficulty={p.Level.Meta.Difficulty}
                    rarity={p.Level.Meta.Rarity}
                    date={p.DateAdded}
                    onContextMenu={(e) => openContext(e, p)}
                    key={p.Level.ID}
                />
            ))}
        </div>
    );
}
