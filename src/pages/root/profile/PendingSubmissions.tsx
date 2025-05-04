import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DeletePendingSubmission from '../../../api/submissions/DeletePendingSubmission';
import GetUserPendingSubmissions, { UserPendingSubmission } from '../../../api/user/GetUserPendingSubmissions';
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
import NewLabel from '../../../components/NewLabel';
import { PermissionFlags } from '../../mod/roles/PermissionFlags';
import { useApproveClicked } from '../../mod/queue/useApproveClicked';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import PendingSubmission from '../../../api/types/PendingSubmission';
import useDenySubmissionModal from '../../../hooks/modals/useDenySubmissionModal';

interface Props {
    userID: number,
}

enum EListType {
    inline = 'inline',
    grid = 'grid'
}

export default function PendingSubmissions({ userID }: Props) {
    const [listType, setListType] = useLocalStorage<EListType>('profile.listType', EListType.grid);
    const [hide, setHide] = useState(true);

    const { status, data: submissionResult } = useQuery({
        queryKey: ['user', userID, 'submissions', 'pending'],
        queryFn: () => GetUserPendingSubmissions(userID),
    });

    if (status === 'loading') {
        return (
            <LoadingSpinner />
        );
    }

    if (!submissionResult?.submissions?.length) {
        return;
    }

    return (
        <div className='mt-6'>
            <div className='flex items-center gap-2 mb-2 flex-wrap'>
                <h2 className='text-3xl' id='pendingSubmissions'>Pending submissions <NewLabel ID='profilePendingSubmissions' /></h2>
                <div className='flex items-center'>
                    {!hide && <>
                        <button className={'text-black w-7 h-7 grid place-items-center ' + (listType === EListType.inline ? 'bg-gray-950 text-white' : 'bg-white')} onClick={() => setListType(EListType.inline)}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' stroke='currentColor' viewBox='0 0 16 16'>
                                <path fillRule='evenodd' d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z' />
                            </svg>
                        </button>
                        <button className={'text-black w-7 h-7 grid place-items-center ' + (listType === EListType.grid ? 'bg-gray-950 text-white' : 'bg-white')} onClick={() => setListType(EListType.grid)}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                                <path d='M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z' />
                            </svg>
                        </button>
                    </>
                    }
                    <SecondaryButton className='ms-2' onClick={() => setHide((prev) => !prev)}>{hide ? 'Show' : 'Hide'}</SecondaryButton>
                </div>
            </div>
            {!hide && (listType === EListType.inline
                ? <InlineList levels={submissionResult.submissions} userID={userID} />
                : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                    {submissionResult.submissions.map((p) => <GridLevel ID={p.LevelID} rating={p.Rating} enjoyment={p.Enjoyment} proof={p.Proof} name={p.Level.Meta.Name} creator={p.Level.Meta.Creator} difficulty={p.Level.Meta.Difficulty} inPack={false} key={p.LevelID} />)}
                </div>)
            }
            {!hide && submissionResult.submissions.length === 0 &&
                <p>No levels</p>
            }
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
                <Level.Header />
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
