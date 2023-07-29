import { useState } from 'react';
import Level from './Level';
import { useQuery } from '@tanstack/react-query';
import { GetUserSubmissions } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';
import SortMenu from './SortMenu';
import { Submission } from '../../../api/submissions';
import { useLocalStorage } from '../../../hooks';
import { GridLevel } from '../../../components/GridLevel';

type Props = {
    userID: number,
}

enum EListType {
    inline = 'inline',
    grid = 'grid'
}

export default function Submissions({ userID }: Props) {
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState<{ sort: string, sortDirection: string}>({ sort: 'LevelID', sortDirection: 'asc'});
    const [listType, setListType] = useLocalStorage<EListType>('profile.listType', EListType.grid);

    const { status, data } = useQuery({
        queryKey: ['user/submissions', { userID, page, ...sort }],
        queryFn: () => GetUserSubmissions({ userID, page: page+1, ...sort }),
    });

    if (status === 'loading') {
        return (
            <LoadingSpinner />
        );
    }

    const submissions = data?.submissions;

    if (submissions === undefined || data === undefined || submissions.length === 0) {
        return;
    }

    return (
        <div className='mt-3'>
            <div className='flex items-center gap-2 mb-2'>
                <h2 className='text-3xl'>Submissions</h2>
                <SortMenu set={setSort} />
                <div className='flex items-center text-black'>
                    <button className={'w-7 h-7 grid place-items-center ' + (listType === EListType.inline ? 'bg-gray-950 text-white' : 'bg-white')} onClick={() => setListType(EListType.inline)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' stroke='currentColor' viewBox='0 0 16 16'>
                            <path fillRule='evenodd' d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'/>
                        </svg>
                    </button>
                    <button className={'w-7 h-7 grid place-items-center ' + (listType === EListType.grid ? 'bg-gray-950 text-white' : 'bg-white')} onClick={() => setListType(EListType.grid)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                            <path d='M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z'/>
                        </svg>
                    </button>
                </div>
            </div>
            {listType === 'inline' ? 
                <InlineList levels={submissions} /> :
                <GridList levels={submissions} />
            }
            <PageButtons onPageChange={setPage} meta={{...data, page }} />
        </div>
    );
}

function InlineList({ levels }: { levels: Submission[] }) {
    return (
        <div className='level-list'>
            <Level isHeader={true} />
            {levels.map((p) => <Level isHeader={false} info={p} key={p.LevelID}/>)}
        </div>
    );
}

function GridList({ levels }: { levels: Submission[] }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {levels.map((p) => <GridLevel info={p} key={p.LevelID}/>)}
        </div>
    );
}