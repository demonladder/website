import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import DeletePendingSubmission from '../../../api/submissions/DeletePendingSubmission';
import { UserPendingSubmission } from '../api/getUserPendingSubmissions';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { GridLevel } from '../../../components/GridLevel';
import Level, { Header } from '../../../components/Level';
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

    const { status, data: submissionResult } = useUserPendingSubmissions(userID);
    const user = useUserQuery(userID);

    if (user.data?.PendingSubmissionCount === 0) return;

    return (
        <div className='mt-6'>
            <div className='flex justify-between gap-2'>
                <Heading2 id='pendingSubmissions'>Pending submissions</Heading2>
                <SegmentedButtonGroup options={viewOptions} activeKey={listType} onSetActive={setListType} />
            </div>
            {status === 'loading' && <LoadingSpinner />}
            {status === 'error' && <p>Error loading submissions</p>}
            {status === 'success' && <>
                {listType === 'inline'
                    ? <InlineList levels={submissionResult.submissions} userID={userID} />
                    : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                        {submissionResult.submissions.map((p) => <GridLevel ID={p.LevelID} rating={p.Rating} enjoyment={p.Enjoyment} proof={p.Proof} name={p.Level.Meta.Name} creator={p.Level.Meta.Creator} difficulty={p.Level.Meta.Difficulty} inPack={false} key={p.LevelID} />)}
                    </div>
                }
                {submissionResult.submissions.length === 0 &&
                    <p>No levels</p>
                }
            </>}
        </div>
    );
}

function InlineList({ levels, userID }: { levels: UserPendingSubmission[], userID: number }) {
    const [clickedSubmission, setClickedSubmission] = useState<UserPendingSubmission>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const openAddListLevelModal = useAddListLevelModal();
    const openDenySubmissionModal = useDenySubmissionModal();

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
                { text: 'Add to list', onClick: () => openAddListLevelModal(submission.UserID, submission.LevelID) },
                { text: 'View proof', onClick: () => window.open(submission.Proof!, '_blank'), disabled: !submission.Proof },
                { text: 'Accept', type: 'info', onClick: () => approveSubmission(submission.ID, submission.LevelID, submission.UserID), permission: PermissionFlags.MANAGE_SUBMISSIONS },
                { text: 'Delete', type: 'danger', onClick: () => setShowDeleteModal(true), userID: submission.UserID },
                { text: 'Deny', type: 'danger', onClick: () => openDenySubmissionModal(submission), permission: PermissionFlags.MANAGE_SUBMISSIONS },
            ],
        });
    }

    function deleteSubmission(submission: PendingSubmission) {
        void toast.promise(DeletePendingSubmission(submission.ID).then(() => {
            void queryClient.invalidateQueries(['user', userID, 'submissions', 'pending']);
            setShowDeleteModal(false);
        }), {
            pending: 'Deleting...',
            success: 'Deleted your submission for ' + levels.find((l) => l.LevelID === submission.LevelID)?.Level.Meta.Name || `(${submission.LevelID})`,
            error: renderToastError,
        });
    }

    return (
        <>
            <div className='level-list'>
                <Header />
                {levels.map((p) => (
                    <Level ID={p.LevelID} rating={p.Rating} actualRating={p.Level.Rating} enjoyment={p.Enjoyment} actualEnjoyment={p.Level.Enjoyment} name={p.Level.Meta.Name} creator={p.Level.Meta.Creator} songName={p.Level.Meta.Song.Name} onContextMenu={(e) => openContext(e, p)} key={p.LevelID} />
                ))}
            </div>
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
