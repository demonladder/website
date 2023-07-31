import { useState, useEffect } from 'react';
import Level from '../../../components/Level';
import FilterMenu from './FilterMenu';
import SortMenu from './SortMenu';
import { Level as TLevel, SearchLevels } from '../../../api/levels';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage, useSessionStorage } from '../../../hooks';
import Container from '../../../components/Container';
import { TextInput } from '../../../components/Input';
import PageButtons from '../../../components/PageButtons';
import { GridLevel } from '../../../components/GridLevel';

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
    exactName: boolean,
    removeCompleted: boolean,
    removeUnrated: boolean,
    removeUnratedEnj: boolean,
    removeRated: boolean,
    removeRatedEnj: boolean,
    IDLow: string,
    IDHigh: string,
}

export default function Ladder() {
    const [sorter, setSorter] = useState({});
    const [pageIndex, setPageIndex] = useState(1);

    //
    // Filter levels
    //
    const [filters, setFilters] = useSessionStorage<SearchFilters>('search.filters', {
        name: '',
        lowTier: '',
        highTier: '',
        enjLow: '',
        enjHigh: '',
        difficulty: 0,
        creator: '',
        song: '',
    
        //Extended
        subLowCount: '',
        subHighCount: '',
        enjLowCount: '',
        enjHighCount: '',
        devLow: '',
        devHigh: '',
        exactName: false,
        removeCompleted: false,
        removeUnrated: true,
        removeUnratedEnj: false,
        removeRated: false,
        removeRatedEnj: false,
        IDLow: '',
        IDHigh: '',
    });
    const [q, setQ] = useSessionStorage('searchQuery', generateQ());
    const [showFilters, setShowFilters] = useSessionStorage('showFilters', false);

    function resetFilters() {
        setFilters({
            name: '',
            lowTier: '',
            highTier: '',
            enjLow: '',
            enjHigh: '',
            difficulty: 0,
            creator: '',
            song: '',
            subLowCount: '',
            subHighCount: '',
            enjLowCount: '',
            enjHighCount: '',
            devLow: '',
            devHigh: '',
            exactName: false,
            removeCompleted: false,
            removeUnrated: true,
            removeUnratedEnj: false,
            removeRated: false,
            removeRatedEnj: false,
            IDLow: '',
            IDHigh: '',
        });
    }

    function generateQ() {
        const joined: any = {
            ...filters,
            ...sorter,
            page: pageIndex,
        };
        const q: any = {};
        for (let p of Object.keys(joined)) {
            if (!joined[p]) continue;
            q[p] = joined[p];
        }
        return q;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            // Runs a little after user input stops
            setQ(generateQ());
        }, 500);

        return () => {
            clearTimeout(timer);
        }
    }, [filters, pageIndex, sorter]);
    
    const { status: searchStatus, data: searchData } = useQuery({
        queryKey: ['search', q],
        queryFn: () => SearchLevels(q),
    });



    const [listView, setListView] = useLocalStorage('search.listView', true);
    function onViewList() {
        if (!listView) setListView(true);
    }

    function onViewGrid() {
        if (listView) setListView(false);
    }

    function List({ levels }: { levels: TLevel[] }) {
        return (
            <div className='level-list'>
                <Level.Header />
                {levels.map(l => <Level info={l} key={l.LevelID} />)}
            </div>
        );
    }
    function Grid({ levels }: { levels: TLevel[] }) {
        return (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                {levels.map(l => <GridLevel info={l} key={l.LevelID} />)}
            </div>
        );
    }

    function Content() {
        const levels = searchData?.levels;
        switch(searchStatus) {
            default:
            case 'loading': {
                if (!levels) return;
                if (listView) return <List levels={levels} />
                else          return <Grid levels={levels} />
            }
            case 'error': {
                return <h2>An error ocurred!</h2>
            }
            case 'success': {
                if (!levels) return;
                if (listView) return <List levels={levels} />;
                else          return <Grid levels={levels} />;
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
                        <path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z'/>
                    </svg>
                </button>
                <SortMenu set={setSorter} />
                <div className='flex items-center text-black'>
                    <button className={'w-7 h-7 grid place-items-center ' + (listView ? 'bg-gray-950 text-white' : 'bg-white')} onClick={onViewList}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' stroke='currentColor' viewBox='0 0 16 16'>
                            <path fillRule='evenodd' d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'/>
                        </svg>
                    </button>
                    <button className={'w-7 h-7 grid place-items-center ' + (!listView ? 'bg-gray-950 text-white' : 'bg-white')} onClick={onViewGrid}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                            <path d='M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z'/>
                        </svg>
                    </button>
                </div>
            </div>
            <FilterMenu filters={filters} setFilters={setFilters} reset={resetFilters} show={showFilters} />
            <div className='my-4'>
                <Content />
            </div>
            {searchData && <PageButtons onPageChange={setPageIndex} meta={{ ...searchData, page: pageIndex }} />}
        </Container>
    );
}