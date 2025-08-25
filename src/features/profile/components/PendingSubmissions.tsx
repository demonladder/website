import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import DeletePendingSubmission from '../../../api/submissions/DeletePendingSubmission';
import { UserPendingSubmission } from '../api/getUserPendingSubmissions';
import { GridLevel } from '../../../components/GridLevel';
import Level from '../../../components/Level';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import Modal from '../../../components/Modal';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { PermissionFlags } from '../../admin/roles/PermissionFlags';
import { useApproveClicked } from '../../admin/queue/hooks/useApproveClicked';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import PendingSubmission from '../../../api/types/PendingSubmission';
import useDenySubmissionModal from '../../../hooks/modals/useDenySubmissionModal';
import { useUserPendingSubmissions } from '../hooks/useUserPendingSubmissions';
import useUserQuery from '../../../hooks/queries/useUserQuery';
import Heading2 from '../../../components/headings/Heading2';
import useSession from '../../../hooks/useSession';
import useDeletePendingSubmissionModal from '../../../hooks/modals/useDeletePendingSubmissionModal';
import User from '../../../api/types/User';
import PageButtons from '../../../components/PageButtons';
import { useApp } from '../../../context/app/useApp';
import { LevelViewType } from '../../../context/app/AppContext';

interface Props {
    userID: number,
}

export default function PendingSubmissions({ userID }: Props) {
    const app = useApp();
    const [page, setPage] = useState(0);

    const { status, data: submissionResult } = useUserPendingSubmissions(userID, { page });
    const user = useUserQuery(userID);

    if (user.data?.PendingSubmissionCount === 0) return;

    return (
        <div className='mt-6'>
            <Heading2 id='pendingSubmissions'>Pending submissions</Heading2>
            {status === 'pending' && <LoadingSpinner />}
            {status === 'error' && <p>Error loading submissions</p>}
            {status === 'success' && user.data && <>
                {app.levelViewType === LevelViewType.LIST
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
                { text: 'View level', to: `/level/${submission.Level.ID}` },
                { text: 'Add to list', onClick: () => openAddListLevelModal(session.user!.ID, submission.Level.ID), requireSession: true },
                { type: 'divider' },
                { text: 'View proof', onClick: () => window.open(submission.Proof!, '_blank'), disabled: !submission.Proof },
                { text: 'Accept', type: 'info', onClick: () => approveSubmission(submission.ID, submission.Level.ID, userID), permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Delete', type: 'danger', onClick: () => setShowDeleteModal(true), userID, permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Deny', type: 'danger', onClick: () => openDenySubmissionModal({ ID: submission.ID, UserID: userID }), permission: PermissionFlags.MANAGE_SUBMISSIONS },
            ],
        });
    }

    function deleteSubmission(submission: Pick<PendingSubmission, 'ID' | 'LevelID'>) {
        void toast.promise(DeletePendingSubmission(submission.ID).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['user', userID, 'submissions', 'pending'] });
            setShowDeleteModal(false);
        }), {
            pending: 'Deleting...',
            success: 'Deleted your submission for ' + levels.find((l) => l.Level.ID === submission.LevelID)?.Level.Meta.Name || `(${submission.LevelID})`,
            error: renderToastError,
        });
    }

    return (
        <>
            <ul>
                {levels.map((p) => (
                    <li key={p.Level.ID}>
                        <Level ID={p.Level.ID} difficulty={p.Level.Meta.Difficulty} rarity={p.Level.Meta.Rarity} rating={p.Rating} actualRating={p.Level.Rating} enjoyment={p.Enjoyment} actualEnjoyment={p.Level.Enjoyment} name={p.Level.Meta.Name} creator={p.Level.Meta.Publisher?.name ?? '-'} songName={p.Level.Meta.Song.Name} position={p.Position} onContextMenu={(e) => openContext(e, p)} />
                    </li>
                ))}
            </ul>
            {clickedSubmission &&
                <Modal title='Delete submission' show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <p>Are you sure you want to delete your pending submission for {clickedSubmission.Level.Meta.Name}? (ID: {clickedSubmission.Level.ID})</p>
                    <div className='flex place-content-end gap-2'>
                        <SecondaryButton onClick={() => setShowDeleteModal(false)}>Close</SecondaryButton>
                        <DangerButton onClick={() => deleteSubmission({ ID: clickedSubmission.ID, LevelID: clickedSubmission.Level.ID })}>Delete</DangerButton>
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

    const approveSubmission = useApproveClicked();

    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserPendingSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'View level', to: `/level/${submission.Level.ID}` },
                { text: 'Add to list', onClick: () => openAddListLevelModal(session.user!.ID, submission.Level.ID), requireSession: true },
                { type: 'divider' },
                { text: 'View proof', onClick: () => window.open(submission.Proof!, '_blank'), disabled: !submission.Proof },
                { text: 'Delete', type: 'danger', onClick: () => openDeleteSubmissionModal({ ID: submission.ID, LevelID: submission.Level.ID, UserID: user.ID }, user.Name), userID: user.ID, permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { type: 'divider', permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Accept', type: 'info', onClick: () => approveSubmission(submission.ID, submission.Level.ID, user.ID), permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Deny', type: 'danger', onClick: () => openDenySubmissionModal({ ID: submission.ID, UserID: user.ID }), permission: PermissionFlags.MANAGE_SUBMISSIONS },
            ],
        });
    }

    return (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {levels.map((p) => (
                <li key={p.Level.ID}>
                    <GridLevel ID={p.Level.ID} difficulty={p.Level.Meta.Difficulty} rarity={p.Level.Meta.Rarity} rating={p.Rating} enjoyment={p.Enjoyment} name={p.Level.Meta.Name} creator={p.Level.Meta.Publisher?.name ?? '-'} proof={p.Proof} inPack={false} date={p.DateAdded} onContextMenu={(e) => openContext(e, p)} />
                </li>
            ))}
        </ul>
    );
}
