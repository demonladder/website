import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUserSubmissions, UserSubmission } from '../../../api/user/GetUserSubmissions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';
import SortMenu from './SortMenu';
import { DeleteSubmission } from '../../../api/submissions';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { GridLevel } from '../../../components/GridLevel';
import Level from '../../../components/Level';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { TextInput } from '../../../components/Input';
import StorageManager from '../../../utils/StorageManager';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import Modal from '../../../components/Modal';
import { DangerButton, SecondaryButton } from '../../../components/Button';
import { useContextMenu } from '../../../components/ui/menuContext/MenuContextContainer';
import useLateValue from '../../../hooks/useLateValue';

type Props = {
    userID: number,
}

enum EListType {
    inline = 'inline',
    grid = 'grid'
}

export default function Submissions({ userID }: Props) {
    const [page, setPage] = useSessionStorage('profilePageIndex_' + userID, 1);
    const [sort, setSort] = useState<{ sort: string, sortDirection: string }>({ sort: 'LevelID', sortDirection: 'asc' });
    const [listType, setListType] = useLocalStorage<EListType>('profile.listType', EListType.grid);
    const [query, lateQuery, setQuery] = useLateValue('', 500);

    const { status, data } = useQuery({
        queryKey: ['user', userID, 'submissions', { page, name: lateQuery, ...sort }],
        queryFn: () => GetUserSubmissions({ userID, page, name: lateQuery, ...sort }),
    });

    if (status === 'loading') {
        return (
            <LoadingSpinner />
        );
    }

    const submissions = data?.submissions;

    if (submissions === undefined || data === undefined) {
        return;
    }

    return (
        <div className='mt-6'>
            <div className='flex items-center gap-2 mb-2 flex-wrap'>
                <h2 className='text-3xl' id='submissions'>Submissions</h2>
                <SortMenu set={setSort} />
                <div className='flex items-center text-black'>
                    <button className={'w-7 h-7 grid place-items-center ' + (listType === EListType.inline ? 'bg-gray-950 text-white' : 'bg-white')} onClick={() => setListType(EListType.inline)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' stroke='currentColor' viewBox='0 0 16 16'>
                            <path fillRule='evenodd' d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z' />
                        </svg>
                    </button>
                    <button className={'w-7 h-7 grid place-items-center ' + (listType === EListType.grid ? 'bg-gray-950 text-white' : 'bg-white')} onClick={() => setListType(EListType.grid)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                            <path d='M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z' />
                        </svg>
                    </button>
                </div>
                <div className='max-md:w-full md:w-60'>
                    <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Filter by name...' />
                </div>
            </div>
            {listType === 'inline' ?
                <InlineList levels={submissions} userID={userID} /> :
                <GridList levels={submissions} />
            }
            {submissions.length === 0 &&
                <p>No levels</p>
            }
            <PageButtons onPageChange={setPage} meta={{ ...data, page }} />
        </div>
    );
}

function InlineList({ levels, userID }: { levels: (UserSubmission)[], userID: number }) {
    const [clickedSubmission, setClickedSubmission] = useState<UserSubmission>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { createMenu } = useContextMenu();

    function openContext(e: React.MouseEvent, submission: UserSubmission) {
        if (userID !== StorageManager.getUser()?.ID) return;

        e.preventDefault();

        setClickedSubmission(submission);
        createMenu({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Info', onClick: () => navigate(`/level/${submission.LevelID}`) },
                { text: 'Add to list', onClick: () => navigate(`/level/${submission.LevelID}`) },
                { text: 'View proof', onClick: () => window.open(submission.Proof!, '_blank'), disabled: submission.Proof === null || submission.Proof === '' },
                { text: 'Delete', type: 'danger', onClick: () => setShowDeleteModal(true) },
            ],
        })
    }

    function deleteSubmission(levelID?: number) {
        if (levelID === undefined) return;

        toast.promise(DeleteSubmission(levelID, userID).then(() => {
            queryClient.invalidateQueries(['level', levelID]);
            queryClient.invalidateQueries(['user', userID, 'submissions']);
            setShowDeleteModal(false);
        }), {
            pending: 'Deleting...',
            success: 'Deleted your submission for ' + levels.find((l) => l.LevelID === levelID)?.Level.Meta.Name || `(${levelID})`,
            error: renderToastError,
        });
    }

    return (
        <>
            <div className='level-list'>
                <Level.Header />
                {levels.map((p) => (
                    <Level ID={p.LevelID} rating={p.Rating} actualRating={p.Level.Rating} enjoyment={p.Enjoyment} actualEnjoyment={p.Level.Rating} name={p.Level.Meta.Name} creator={p.Level.Meta.Creator} songName={p.Level.Meta.Song.Name} onContextMenu={(e) => openContext(e, p)} key={p.LevelID} />
                ))}
            </div>
            {showDeleteModal && clickedSubmission &&
                <Modal title='Delete submission' show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <Modal.Body>
                        <p>Are you sure you want to delete your submission for {clickedSubmission.Level.Meta.Name}? (ID: {clickedSubmission.LevelID})</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='flex place-content-end gap-2'>
                            <SecondaryButton onClick={() => setShowDeleteModal(false)}>Close</SecondaryButton>
                            <DangerButton onClick={() => deleteSubmission(clickedSubmission.LevelID)}>Delete</DangerButton>
                        </div>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
}

function GridList({ levels }: { levels: UserSubmission[] }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {levels.map((p) => <GridLevel ID={p.LevelID} rating={p.Rating} enjoyment={p.Enjoyment} proof={p.Proof} name={p.Level.Meta.Name} creator={p.Level.Meta.Creator} difficulty={p.Level.Meta.Difficulty} inPack={false} key={p.LevelID} />)}
        </div>
    );
}