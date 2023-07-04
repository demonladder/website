import React, { useState, useEffect } from 'react';
import Level from './Level';
import filterEmpty from '../../../icons/filter-empty.svg';
import FilterMenu, { Filters } from './FilterMenu';
import caretR from '../../../icons/caret-r.svg';
import caretL from '../../../icons/caret-l.svg';
import { ReactComponent as ListSVG } from '../../../icons/list.svg';
import { ReactComponent as GridSVG } from '../../../icons/grid.svg';
import { ReactComponent as Cross } from '../../../icons/cross.svg';
import SortMenu from './SortMenu';
import { Level as TLevel, SearchLevels } from '../../../api/levels';
import { useQuery } from '@tanstack/react-query';
import { TExtendedFilters } from './FiltersExtended';
import { useSessionStorage } from '../../../functions';

export default function Ladder() {
    const [sorter, setSorter] = useState({});
    const [pageIndex, setPageIndex] = useState(0);
    const [levels, setLevels] = useState<TLevel[]>([]);

    //
    // Filter levels
    //
    const [filters, setFilters] = useState({ lowTier: '', highTier: '', enjLow: '', enjHigh: '', difficulty: 0, creator: '', song: '' });
    const [extendedFilters, setExtendedFilters] = useSessionStorage('extendedFilters', { subLowCount: '', subHighCount: '', enjLowCount: '', enjHighCount: '', enjLow:'', enjHigh: '', devLow: '', devHigh: '', removeUnrated: false });
    const [search, setSearch] = useSessionStorage('search.input', '');
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const [q, setQ] = useSessionStorage('searchQuery', generateQ());
    const [showFilters, setShowFilters] = useSessionStorage('showFilters', false);

    function generateQ() {
        const joined: any = {
            ...filters,
            ...extendedFilters,
            ...sorter,
            page: pageIndex+1,
            name: search
        };
        const q: any = {};
        for (let p of Object.keys(joined)) {
            if (!joined[p]) continue;
            q[p] = joined[p];
        }
        return q;
    }

    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            // Runs a little after user input stops
            setQ(generateQ());
        }, 500));  // eslint-disable-next-line
    }, [search, filters, extendedFilters, pageIndex, sorter]);
    
    const { status: searchStatus, data: searchData } = useQuery({
        queryKey: ['search', q],
        queryFn: () => SearchLevels(q),
        onSuccess: (data) => {setLevels(data.levels)},
        retryDelay: 500,
        cacheTime: 0
    });

    const pageUp = () => {
        if (searchStatus !== 'success') return;
        if (pageIndex + 1 < searchData.count / 15) {
            setPageIndex(prev => prev + 1);
        }
    }
    const pageDown = () => {
        if (searchStatus !== 'success') return;
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1);
        }
    }

    useEffect(() => {  // Watch for changes in search and filters
        setPageIndex(0);  // Reset index to page 1
    }, [search, filters]);



    const [listView, setListView] = useState(true);
    function onViewList() {
        if (!listView) setListView(true);
    }

    function onViewGrid() {
        if (listView) setListView(false);
    }

    function List({ levels }: {levels: TLevel[]}) {
        return (
            <div className='d-flex flex-column'>
                <Level.Header />
                {levels.map(l => <Level info={l} key={l.ID} />)}
            </div>
        );
    }
    function Grid({ levels }: {levels: TLevel[]}) {
        return (
            <>
                <div className='d-flex flex-column col-12 col-xl-6 p-0 m-0'>
                    {levels.slice(0, (levels.length+1)/2).map(l => <Level.Grid info={l} key={l.ID} />)}
                </div>
                <div className='d-flex flex-column col-12 col-xl-6 p-0 m-0'>
                    {levels.slice((levels.length+1)/2).map(l => <Level.Grid info={l} key={l.ID} />)}
                </div>
            </>
        );
    }

    function Content() {
        switch(searchStatus) {
            default:
            case 'loading': {
                if (!levels) return <></>;
                if (listView) return <List levels={levels} />
                else          return <Grid levels={levels} />
            }
            case 'error': {
                return <h2>An error ocurred!</h2>
            }
            case 'success': {
                if (listView) return <List levels={searchData.levels} />;
                else          return <Grid levels={searchData.levels} />;
            }
        }
    }
    
    //{searchStatus === 'loading' && <LoadingSpinner />}
    return (
        <div className='container'>
            <h1>The Ladder</h1>
            <div className='d-flex align-items-center search'>
                <div className='searchBar'>
                    <input type='text' placeholder='Search level name...' value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className='clearSearch' onClick={() => setSearch('')}>
                        <Cross />
                    </button>
                </div>
                <button className='btn btn-light btn-sm m-1 px-3 h-100' onClick={() => setShowFilters((prev: boolean) => !prev)}>
                    <img src={filterEmpty} alt='' />
                </button>
                <SortMenu set={setSorter} />
                <div className='d-flex align-items-center m-1 h-100'>
                    <button className={'list view-left ' + (listView ? 'active' : '')} onClick={onViewList}>
                        <ListSVG />
                    </button>
                    <button className={'list view-right ' + (!listView ? 'active' : '')} onClick={onViewGrid}>
                        <GridSVG />
                    </button>
                </div>
            </div>
            <FilterMenu filter={setFilters} setExtended={setExtendedFilters} show={showFilters} />
            <div className={'level-list my-3' + (listView ? '' : ' d-flex flex-column flex-xl-row gap-xl-2')}>
                <Content />
            </div>
            <div className='d-flex align-items-center'>
                <button className='page-scroller' onClick={pageDown}><img src={caretL} alt='Previous page' /></button>
                <p className='text-center m-0 mx-5 fs-3 cursor-default'>{pageIndex + 1} / {(searchData && Math.ceil(searchData.count/16)) || 0}</p>
                <button className='page-scroller' onClick={pageUp}><img src={caretR} alt='Next page' /></button>
            </div>
        </div>
    );
}