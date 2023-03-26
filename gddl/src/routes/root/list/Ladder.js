import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import Level from './Level';
import filterEmpty from '../../../icons/filter-empty.svg';
import FilterMenu from './FilterMenu';
import caretR from '../../../icons/caret-r.svg';
import caretL from '../../../icons/caret-l.svg';
import { ReactComponent as ListSVG } from '../../../icons/list.svg';
import { ReactComponent as GridSVG } from '../../../icons/grid.svg';
import serverIP from '../../../serverIP';
import SortMenu, { closeSortMenu } from './SortMenu';
import axios from 'axios';

export async function ladderLoader() {
    return fetch(`${serverIP}/getLevels`)
    .then(res => res.json())
    .then(data => {
        return {
            error: false,
            data
        };
    })
    .catch((e) => {
        return { error: true, message: 'Couldn\'t connect to the sever!' };
    });
}

export function toggleShowFilter() {
    const content = document.getElementById('filter-menu');
    content.getBoundingClientRect()

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.overflow = 'hidden';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        setTimeout(() => {content.style.overflow = 'visible';}, 500);
        closeSortMenu();
    }
}

export default function Ladder() {
    const [loaderResponse, setLoaderResponse] = useState(useLoaderData());
    const [levels, setLevels] = useState(!loaderResponse.error ? loaderResponse.data : { count: 0, levels: [] });
    useEffect(() => {
        setLevels(!loaderResponse.error ? loaderResponse.data : { count: 0, levels: [] });
    }, [loaderResponse]);

    const [pageIndex, setPageIndex] = useState(0);
    const pageUp = () => {
        if (levels.error) return;
        if (pageIndex + 1 < levels.count / 15) {
            setPageIndex(prev => prev + 1);
        }
    }
    const pageDown = () => {
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1);
        }
    }

    const [sorter, setSorter] = useState({});

    //
    // Filter levels
    //
    const [filters, setFilters] = useState({ lowTier: '', highTier: '', difficulty: 0, removeUnrated: false, creator: '', song: '' });
    const [extendedFilters, setExtendedFilters] = useState({ subLowCount: '', subHighCount: '', enjLowCount: '', enjHighCount: '', enjLow:'', enjHigh: '', devLow: '', devHigh: '' });
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState();

    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            // Runs a little after user input stops
            const joined = {
                ...filters,
                ...extendedFilters,
                ...sorter,
                page: pageIndex,
                name: search
            };
            const q = {};
            for (let p of Object.keys(joined)) {
                if (!joined[p]) continue;
                q[p] = joined[p];
            }

            axios.get(`${serverIP}/getLevels`, {
                withCredentials: 'include',
                params: q
            }).then(res => setLoaderResponse({ error: false, data: res.data }))
            .catch(e => {
                if (e.response.status === 404) {
                    setLoaderResponse({ error: true, message: 'No results!' });
                    return;
                }

                setLoaderResponse({ error: true, message: 'Couldn\'t connect to the sever!' });
            });
        }, 500));
    }, [search, filters, extendedFilters, pageIndex, sorter]);

    useEffect(() => {  // Watch for changes in search and filters
        setPageIndex(0);  // Reset index to page 1
    }, [search, filters]);



    function onSearchChange(event) {
        setSearch(event.target.value);
    }

    function clearSearch() {
        setSearch('');
    }

    const [listView, setListView] = useState(true);
    function onViewList() {
        if (!listView) setListView(true);
    }

    function onViewGrid() {
        if (listView) setListView(false);
    }

    const list = (
        <div className='d-flex flex-column'>
            <Level info={{ Name: 'Level Name', Song: 'Song', Creator: 'Creator', ID: 'Level ID', Rating: 'Tier', isHeader: true}} isListView={listView} key={-1} />
            {!loaderResponse.error ? levels.levels.map(l => <Level info={l} isListView={listView} key={l.ID} />)
            : <h1 className='m-5'>{loaderResponse.message}</h1>}
        </div>
    );

    const grid = (
        <>
            <div className='d-flex flex-column col-12 col-xl-6 p-0 m-0'>
                <Level info={{ Name: 'Level Name', Song: 'Song', Creator: 'Creator', ID: 'Level ID', Rating: 'Tier', isHeader: true}} isListView={listView} key={-1} />
                {!loaderResponse.error ? levels.levels.slice(0, (levels.levels.length+1)/2).map(l => <Level info={l} isListView={listView} key={l.ID} />)
                : <h1 className='m-5'>{loaderResponse.message}</h1>}
            </div>
            <div className='d-flex flex-column col-12 col-xl-6 p-0 m-0'>
                {!loaderResponse.error ? levels.levels.slice((levels.levels.length+1)/2).map(l => <Level info={l} isListView={listView} key={l.ID} />)
                : <h1 className='m-5'>{loaderResponse.message}</h1>}
            </div>
        </>
    );

    return (
        <div className='container'>
            <h1>The Ladder</h1>
            <div className='d-flex align-items-center search'>
                <div className='search-bar'>
                    <input type='text' placeholder='  Search level name...' name='query' value={search} onChange={onSearchChange} />
                    <button className='clear-search' onClick={clearSearch}>X</button>
                </div>
                <button className='btn btn-light btn-sm m-1 px-3 h-100' onClick={toggleShowFilter}>
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
            <FilterMenu filter={setFilters} setExtended={setExtendedFilters} />
            <div id='level-list' className={'my-3' + (listView ? '' : ' d-flex flex-column flex-xl-row')}>
                {listView ? list : grid}
            </div>
            <div className='d-flex align-items-center'>
                <button className='page-scroller' onClick={pageDown}><img src={caretL} alt='' /></button>
                <p className='text-center m-0 mx-5 fs-3'>{pageIndex + 1} / {Math.ceil(levels.count/16) || 0}</p>
                <button className='page-scroller' onClick={pageUp}><img src={caretR} alt='' /></button>
            </div>
        </div>
    );
}