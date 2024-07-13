import { useState, useEffect, useCallback } from 'react';
import Level from '../../../components/Level';
import FilterMenu from './FilterMenu';
import SortMenu from './SortMenu';
import SearchLevels, { SearchLevelDTO } from '../../../api/level/SearchLevels';
import { useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import { TextInput } from '../../../components/Input';
import PageButtons from '../../../components/PageButtons';
import { GridLevel } from '../../../components/GridLevel';
import useSessionStorage from '../../../hooks/useSessionStorage';
import useLocalStorage from '../../../hooks/useLocalStorage';

export type SearchFilters = {
    name: string,
    lowTier: string,
    highTier: string,
    enjLow: string,
    enjHigh: string,
    difficulty: number,
    creator: string,
    song: string,

    //Extended
    subLowCount: string,
    subHighCount: string,
    enjLowCount: string,
    enjHighCount: string,
    devLow: string,
    devHigh: string,
    inPack: boolean,
    removeCompleted: boolean,
    removeUnrated: boolean,
    removeUnratedEnj: boolean,
    removeRated: boolean,
    removeRatedEnj: boolean,
    IDLow: string,
    IDHigh: string,
    twoPlayer: string,
    length: string,
    update: string,
    skillset: number,
}

const resetObj = {
    name: '',
    lowTier: '',
    highTier: '',
    enjLow: '',
    enjHigh: '',
    difficulty: -1,
    creator: '',
    song: '',

    //Extended
    subLowCount: '',
    subHighCount: '',
    enjLowCount: '',
    enjHighCount: '',
    devLow: '',
    devHigh: '',
    inPack: false,
    removeCompleted: false,
    removeUnrated: false,
    removeUnratedEnj: false,
    removeRated: false,
    removeRatedEnj: false,
    IDLow: '',
    IDHigh: '',
    twoPlayer: 'any',
    length: '0',
    update: 'any',
    skillset: 0,
};

export default function Search() {
    const [sorter, setSorter] = useState({});
    const [pageIndex, setPageIndex] = useSessionStorage('search.pageIndex', 1);
    const [filters, setFilters] = useSessionStorage<SearchFilters>('search.filters', { ...resetObj });

    const generateQ = useCallback((pageIndex: number) => {
        const joined: any = {
            ...filters,
            ...sorter,
            page: pageIndex,
        };
        const q: any = {};
        for (let p of Object.keys(joined)) {
            if (joined[p] === null || joined[p] === undefined || joined[p] === '') continue;
            q[p] = joined[p];
        }
        return q;
    }, [filters, sorter, pageIndex]);

    //
    // Filter levels
    //
    const [q, setQ] = useSessionStorage('searchQuery', generateQ(pageIndex));
    const [showFilters, setShowFilters] = useSessionStorage('showFilters', false);

    function resetFilters() {
        setFilters({ ...resetObj });
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            // Runs a little after user input stops
            setQ(generateQ(pageIndex));
        }, 500);

        return () => {
            clearTimeout(timer);
        }
    }, [filters, sorter]);

    const { status: searchStatus, data: searchData } = useQuery({
        queryKey: ['search', q],
        queryFn: () => SearchLevels(q),
    });

    useEffect(() => {
        if (searchData) {
            if (searchData.total < (pageIndex - 1) * searchData.limit) {
                setPageIndex(1);
            }
        }
    }, [searchData]);

    const onPageChange = useCallback((page: number) => {
        setPageIndex(page);
        setQ(generateQ(page));
    }, [setPageIndex, setQ, generateQ]);



    const [listView, setListView] = useLocalStorage('search.listView', true);
    function onViewList() {
        if (!listView) setListView(true);
    }

    function onViewGrid() {
        if (listView) setListView(false);
    }

    function List({ levels }: { levels: SearchLevelDTO[] }) {
        return (
            <div className='level-list'>
                <Level.Header />
                {levels.map((l) => <Level ID={l.ID} rating={l.Rating} defaultRating={l.DefaultRating} enjoyment={l.Enjoyment} name={l.Meta.Name} creator={l.Meta.Creator} songName={l.Meta.Song.Name} completed={l.Completed === 1} key={l.ID} />)}
            </div>
        );
    }
    function Grid({ levels }: { levels: SearchLevelDTO[] }) {
        return (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                {levels.map((l) => <GridLevel ID={l.ID} rating={l.Rating ?? l.DefaultRating} enjoyment={l.Enjoyment} name={l.Meta.Name} creator={l.Meta.Creator} difficulty={l.Meta.Difficulty} inPack={l.InPack === 1} key={l.ID} />)}
            </div>
        );
    }

    function Content() {
        const levels = searchData?.levels;
        switch (searchStatus) {
            default:
            case 'loading': {
                if (!levels) return;
                if (listView) return <List levels={levels} />
                else return <Grid levels={levels} />
            }
            case 'error': {
                return <h2>An error ocurred!</h2>
            }
            case 'success': {
                if (!levels) return;
                if (levels.length === 0) return <h2 className='text-3xl'>No levels found!</h2>
                if (listView) return <List levels={levels} />;
                else return <Grid levels={levels} />;
            }
        }
    }

    //{searchStatus === 'loading' && <LoadingSpinner />}
    return (
        <Container className='bg-gray-800'>
            <h1 className='text-4xl mb-2'>The Ladder</h1>
            <div className='flex items-center gap-1'>
                <div className='relative flex-grow group'>
                    <TextInput placeholder='Search level name...' value={filters.name} onChange={(e) => { setFilters(prev => ({ ...prev, name: e.target.value })); setPageIndex(1) }} />
                    <button className='absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity' onClick={() => setFilters(prev => ({ ...prev, name: '' }))}>
                        <svg width='16' height='16' stroke='currentColor' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'>
                            <path strokeWidth='2' strokeLinecap='round' d='M4 4l22 22M4 26l22 -22' />
                        </svg>
                    </button>
                </div>
                <button className='bg-white text-black w-7 h-7 grid place-items-center' onClick={() => setShowFilters((prev: boolean) => !prev)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px' fill='currentColor' viewBox='0 0 16 16'>
                        <path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z' />
                    </svg>
                </button>
                <SortMenu set={setSorter} />
                <div className='flex items-center text-black'>
                    <button className={'w-7 h-7 grid place-items-center ' + (listView ? 'bg-gray-950 text-white' : 'bg-white')} onClick={onViewList}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' stroke='currentColor' viewBox='0 0 16 16'>
                            <path fillRule='evenodd' d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z' />
                        </svg>
                    </button>
                    <button className={'w-7 h-7 grid place-items-center ' + (!listView ? 'bg-gray-950 text-white' : 'bg-white')} onClick={onViewGrid}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                            <path d='M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z' />
                        </svg>
                    </button>
                </div>
            </div>
            <FilterMenu filters={filters} setFilters={setFilters} reset={resetFilters} show={showFilters} />
            <div className='my-4'>
                <Content />
            </div>
            {searchData && <PageButtons onPageChange={onPageChange} meta={{ ...searchData, page: pageIndex }} />}
        </Container>
    );
}