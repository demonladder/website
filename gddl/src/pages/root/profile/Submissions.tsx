import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetUserSubmissions } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';
import SortMenu from './SortMenu';
import { Submission } from '../../../api/submissions';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { GridLevel } from '../../../components/GridLevel';
import Level from '../../../components/Level';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { TextInput } from '../../../components/Input';
import StorageManager from '../../../utils/StorageManager';
import MenuContext from '../../../components/ui/MenuContext';
import { useNavigate } from 'react-router-dom';

type Props = {
    userID: number,
}

enum EListType {
    inline = 'inline',
    grid = 'grid'
}

interface Query {
    name: string;
}

export default function Submissions({ userID }: Props) {
    const [page, setPage] = useSessionStorage('profilePageIndex_' + userID, 1);
    const [sort, setSort] = useState<{ sort: string, sortDirection: string }>({ sort: 'LevelID', sortDirection: 'asc' });
    const [listType, setListType] = useLocalStorage<EListType>('profile.listType', EListType.grid);
    const [nameFilter, setNameFilter] = useState('');
    const [query, setQuery] = useState<Query>();

    const { status, data } = useQuery({
        queryKey: ['user/submissions', { userID, page, ...query, ...sort }],
        queryFn: () => GetUserSubmissions({ userID, page, ...query, ...sort }),
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            // Runs a little after user input stops
            setQuery({
                name: nameFilter,
            });
        }, 500);

        return () => {
            clearTimeout(timer);
        }
    }, [nameFilter]);

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
        <div className='mt-3'>
            <div className='flex items-center gap-2 mb-2 flex-wrap'>
                <h2 className='text-3xl'>Submissions</h2>
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
                    <TextInput onChange={(e) => setNameFilter(e.target.value)} placeholder='Filter by name...' />
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

function InlineList({ levels, userID }: { levels: Submission[], userID: number }) {
    const [rightClicked, setRightClicked] = useState(false);
    const [clickedID, setClickedID] = useState<number>();
    const [point, setPoint] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    function openContext(e: React.MouseEvent, levelID: number) {
        if (userID !== StorageManager.getUser()?.ID) return;

        e.preventDefault();

        setRightClicked(true);
        setClickedID(levelID);
        setPoint({
            x: e.clientX,
            y: e.clientY,
        });
    }

    useEffect(() => {
        function close(e: MouseEvent) {
            // Only close if the event target wasn't the context menu
            if ((e.target as HTMLDivElement).offsetParent != menuRef.current) {
                setRightClicked(false);
            }
        }

        document.addEventListener('click', close);

        return () => {
            document.removeEventListener('click', close);
        }
    }, []);

    return (
        <>
            <div className='level-list'>
                <Level.Header />
                {levels.map((p) => (
                    <Level isHeader={false} info={p} key={p.LevelID} onContextMenu={(e) => openContext(e, p.LevelID)} />
                ))}
            </div>
            {rightClicked &&
                <MenuContext ref={menuRef} point={point} data={[
                    { text: 'Info', onClick: () => navigate(`/level/${clickedID}`) },
                    { text: 'Delete', danger: true }
                ]} />
            }
        </>
    );
}

function GridList({ levels }: { levels: Submission[] }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {levels.map((p) => <GridLevel info={p} key={p.LevelID} />)}
        </div>
    );
}