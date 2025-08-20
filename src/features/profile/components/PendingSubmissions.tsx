import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import DeletePendingSubmission from '../../../api/submissions/DeletePendingSubmission';
import { UserPendingSubmission } from '../api/getUserPendingSubmissions';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { GridLevel } from '../../../components/GridLevel';
import Level from '../../../components/Level';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import Modal from '../../../components/Modal';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { PermissionFlags } from '../../admin/roles/PermissionFlags';
import { useApproveClicked } from '../../../pages/mod/queue/useApproveClicked';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import PendingSubmission from '../../../api/types/PendingSubmission';
import useDenySubmissionModal from '../../../hooks/modals/useDenySubmissionModal';
import { useUserPendingSubmissions } from '../hooks/useUserPendingSubmissions';
import useUserQuery from '../../../hooks/queries/useUserQuery';
import SegmentedButtonGroup from '../../../components/input/buttons/segmented/SegmentedButtonGroup';
import Heading2 from '../../../components/headings/Heading2';
import useSession from '../../../hooks/useSession';
import useDeletePendingSubmissionModal from '../../../hooks/modals/useDeletePendingSubmissionModal';
import User from '../../../api/types/User';
import PageButtons from '../../../components/PageButtons';

interface Props {
    userID: number,
}

const viewOptions = {
    inline: 'Inline',
    grid: 'Grid',
} as const;
type ViewOption = keyof typeof viewOptions;

export default function PendingSubmissions({ userID }: Props) {
    const [listType, setListType] = useLocalStorage<ViewOption>('profile.listType', 'grid');
    const [page, setPage] = useState(0);

    const { status, data: submissionResult } = useUserPendingSubmissions(userID, { page });
    const user = useUserQuery(userID);

    if (user.data?.PendingSubmissionCount === 0) return;

    return (
        <div className='mt-6'>
            <div className='flex justify-between gap-2'>
                <Heading2 id='pendingSubmissions'>Pending submissions</Heading2>
                <SegmentedButtonGroup options={viewOptions} activeKey={listType} onSetActive={setListType} />
            </div>
            {status === 'pending' && <LoadingSpinner />}
            {status === 'error' && <p>Error loading submissions</p>}
            {status === 'success' && user.data && <>
                {listType === 'inline'
                    ? <InlineList levels={submissionResult.submissions} userID={userID} />
                    : <GridList levels={submissionResult.submissions} user={user.data} />
                }
                {submissionResult.submissions.length === 0 &&
                    <p>No levels</p>
                }
                <PageButtons onPageChange={setPage} meta={{ page, limit: submissionResult.limit, total: submissionResult.total }} />
            </>}
        </div>
    );
}

function InlineList({ levels, userID }: { levels: UserPendingSubmission[], userID: number }) {
    const [clickedSubmission, setClickedSubmission] = useState<UserPendingSubmission>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const openAddListLevelModal = useAddListLevelModal();
    const openDenySubmissionModal = useDenySubmissionModal();
    const session = useSession();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const approveSubmission = useApproveClicked();

    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserPendingSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setClickedSubmission(submission);

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'View level', onClick: () => navigate(`/level/${submission.LevelID}`) },
                { text: 'Add to list', onClick: () => openAddListLevelModal(session.user!.ID, submission.LevelID), requireSession: true },
                { type: 'divider' },
                { text: 'View proof', onClick: () => window.open(submission.Proof!, '_blank'), disabled: !submission.Proof },
                { text: 'Accept', type: 'info', onClick: () => approveSubmission(submission.ID, submission.LevelID, submission.UserID), permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Delete', type: 'danger', onClick: () => setShowDeleteModal(true), userID: submission.UserID, permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Deny', type: 'danger', onClick: () => openDenySubmissionModal(submission), permission: PermissionFlags.MANAGE_SUBMISSIONS },
            ],
        });
    }

    function deleteSubmission(submission: PendingSubmission) {
        void toast.promise(DeletePendingSubmission(submission.ID).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['user', userID, 'submissions', 'pending'] });
            setShowDeleteModal(false);
        }), {
            pending: 'Deleting...',
            success: 'Deleted your submission for ' + levels.find((l) => l.LevelID === submission.LevelID)?.Level.Meta.Name || `(${submission.LevelID})`,
            error: renderToastError,
        });
    }

    return (
        <>
            <ul>
                {levels.map((p) => (
                    <li key={p.LevelID}>
                        <Level ID={p.LevelID} difficulty={p.Level.Meta.Difficulty} rarity={p.Level.Meta.Rarity} rating={p.Rating} actualRating={p.Level.Rating} enjoyment={p.Enjoyment} actualEnjoyment={p.Level.Enjoyment} name={p.Level.Meta.Name} creator={p.Level.Meta.Creator} songName={p.Level.Meta.Song.Name} position={p.Position} onContextMenu={(e) => openContext(e, p)} />
                    </li>
                ))}
            </ul>
            {clickedSubmission &&
                <Modal title='Delete submission' show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <p>Are you sure you want to delete your pending submission for {clickedSubmission.Level.Meta.Name}? (ID: {clickedSubmission.LevelID})</p>
                    <div className='flex place-content-end gap-2'>
                        <SecondaryButton onClick={() => setShowDeleteModal(false)}>Close</SecondaryButton>
                        <DangerButton onClick={() => deleteSubmission(clickedSubmission)}>Delete</DangerButton>
                    </div>
                </Modal>
            }
        </>
    );
}

function GridList({ levels, user }: { levels: UserPendingSubmission[], user: User }) {
    const openAddListLevelModal = useAddListLevelModal();
    const openDenySubmissionModal = useDenySubmissionModal();
    const openDeleteSubmissionModal = useDeletePendingSubmissionModal();
    const session = useSession();

    const navigate = useNavigate();

    const approveSubmission = useApproveClicked();

    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserPendingSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'View level', onClick: () => navigate(`/level/${submission.LevelID}`) },
                { text: 'Add to list', onClick: () => openAddListLevelModal(session.user!.ID, submission.LevelID), requireSession: true },
                { type: 'divider' },
                { text: 'View proof', onClick: () => window.open(submission.Proof!, '_blank'), disabled: !submission.Proof },
                { text: 'Delete', type: 'danger', onClick: () => openDeleteSubmissionModal(submission, user.Name), userID: submission.UserID, permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { type: 'divider', permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Accept', type: 'info', onClick: () => approveSubmission(submission.ID, submission.LevelID, submission.UserID), permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Deny', type: 'danger', onClick: () => openDenySubmissionModal(submission), permission: PermissionFlags.MANAGE_SUBMISSIONS },
            ],
        });
    }

    return (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {levels.map((p) => (
                <li key={p.LevelID}>
                    <GridLevel ID={p.LevelID} difficulty={p.Level.Meta.Difficulty} rarity={p.Level.Meta.Rarity} rating={p.Rating} enjoyment={p.Enjoyment} name={p.Level.Meta.Name} creator={p.Level.Meta.Creator} proof={p.Proof}  inPack={false} onContextMenu={(e) => openContext(e, p)} />
                </li>
            ))}
        </ul>
    );
}
