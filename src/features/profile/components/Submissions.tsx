import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sorts, UserSubmission, getUserSubmissions } from '../api/getUserSubmissions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';
import SortMenu from './SortMenu';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { GridLevel } from '../../../components/GridLevel';
import Level, { Header } from '../../../components/Level';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { TextInput } from '../../../components/Input';
import { useNavigate } from 'react-router-dom';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import useLateValue from '../../../hooks/useLateValue';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import useDeleteSubmissionModal from '../../../hooks/modals/useDeleteSubmissionModal';
import User from '../../../api/types/User';
import Heading2 from '../../../components/headings/Heading2';

interface Props {
    user: User;
};

enum EListType {
    inline = 'inline',
    grid = 'grid'
}

export default function Submissions({ user }: Props) {
    const [page, setPage] = useSessionStorage(`profilePageIndex_${user.ID}`, 0);
    const [sort, setSort] = useState<{ sort: Sorts, sortDirection: string }>({ sort: Sorts.LEVEL_ID, sortDirection: 'asc' });
    const [listType, setListType] = useLocalStorage<EListType>('profile.listType', EListType.grid);
    const [query, lateQuery, setQuery] = useLateValue('', 500);
    const [onlyIncomplete, setOnlyIncomplete] = useState(false);

    const { status, data: submissionResult } = useQuery({
        queryKey: ['user', user.ID, 'submissions', { page, name: lateQuery, onlyIncomplete, ...sort }],
        queryFn: () => getUserSubmissions({ userID: user.ID, page, name: lateQuery, onlyIncomplete, ...sort }),
    });

    useEffect(() => {
        if (submissionResult?.total !== 0 && submissionResult?.submissions.length === 0) setPage(0);
    }, [submissionResult, setPage]);

    if (status === 'loading') return (<LoadingSpinner />);

    const submissions = submissionResult?.submissions;

    if (submissions === undefined || submissionResult === undefined) {
        return;
    }

    return (
        <section className='mt-6'>
            <div className='flex items-center gap-2 mb-2 flex-wrap'>
                <Heading2 id='submissions'>Submissions</Heading2>
                <SortMenu set={setSort} />
                <div className='flex items-center text-black'>
                    <button className={'w-7 h-7 grid place-items-center ' + (listType === EListType.inline ? 'bg-theme-950 text-white' : 'bg-white')} onClick={() => setListType(EListType.inline)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' stroke='currentColor' viewBox='0 0 16 16'>
                            <path fillRule='evenodd' d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z' />
                        </svg>
                    </button>
                    <button className={'w-7 h-7 grid place-items-center ' + (listType === EListType.grid ? 'bg-theme-950 text-white' : 'bg-white')} onClick={() => setListType(EListType.grid)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                            <path d='M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z' />
                        </svg>
                    </button>
                </div>
                <button className={'w-7 h-7 grid place-items-center text-black ' + (onlyIncomplete ? 'bg-theme-950 text-white' : 'bg-white')} onClick={() => setOnlyIncomplete((prev) => !prev)}>
                    <span><b>%</b></span>
                </button>
                <div className='max-md:w-full md:w-60'>
                    <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Filter by name...' />
                </div>
            </div>
            {listType === EListType.inline ?
                <InlineList levels={submissions} user={user} /> :
                <GridList levels={submissions} user={user} />
            }
            {submissions.length === 0 &&
                <p>No levels</p>
            }
            <PageButtons onPageChange={setPage} meta={{ ...submissionResult, page }} />
        </section>
    );
}

function InlineList({ levels, user }: { levels: (UserSubmission)[], user: User }) {
    const openAddListLevelModal = useAddListLevelModal();
    const openDeleteSubmissionModal = useDeleteSubmissionModal();

    const navigate = useNavigate();

    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Go to level', onClick: () => navigate(`/level/${submission.LevelID}`) },
                { text: 'Add to list', onClick: () => openAddListLevelModal(user.ID, submission.LevelID) },
                { text: <>View proof <i className='bx bx-link-external' /></>, onClick: () => window.open(submission.Proof!, '_blank'), disabled: submission.Proof === null || submission.Proof === '' },
                { text: 'Delete', type: 'danger', userID: submission.UserID, onClick: () => openDeleteSubmissionModal(submission.Level, { ...submission, User: user }) },
            ],
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
        </>
    );
}

function GridList({ levels, user }: { levels: UserSubmission[], user: User }) {
    const openAddListLevelModal = useAddListLevelModal();
    const openDeleteSubmissionModal = useDeleteSubmissionModal();

    const navigate = useNavigate();
    
    const setContext = useContextMenu();
    function openContext(e: React.MouseEvent, submission: UserSubmission) {
        e.preventDefault();
        e.stopPropagation();

        setContext({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Go to level', onClick: () => navigate(`/level/${submission.LevelID}`) },
                { text: 'Add to list', onClick: () => openAddListLevelModal(user.ID, submission.LevelID) },
                { text: <>View proof <i className='bx bx-link-external' /></>, onClick: () => window.open(submission.Proof!, '_blank'), disabled: !submission.Proof },
                { text: 'Delete', type: 'danger', onClick: () => openDeleteSubmissionModal(submission.Level, { ...submission, User: user }), userID: submission.UserID },
            ],
        });
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {levels.map((p) => <GridLevel ID={p.LevelID} rating={p.Rating} enjoyment={p.Enjoyment} proof={p.Proof} name={p.Level.Meta.Name} creator={p.Level.Meta.Creator} difficulty={p.Level.Meta.Difficulty} inPack={false} onContextMenu={(e) => openContext(e, p)} key={p.LevelID} />)}
        </div>
    );
}
