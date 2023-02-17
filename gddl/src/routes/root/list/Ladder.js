import React, { useState, useEffect } from 'react';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import Level from './Level';
import filterEmpty from '../../../icons/filter-empty.svg';
import FilterMenu from './FilterMenu';
import sort from '../../../icons/sort.svg';
import sortUp from '../../../icons/sort-up.svg';
import caretR from '../../../icons/caret-r.svg';
import caretL from '../../../icons/caret-l.svg';
import listSVG from '../../../icons/list.svg';
import gridSVG from '../../../icons/grid.svg';
import serverIP from '../../../serverIP';

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

export default function Ladder() {
    const [sessionID] = useOutletContext();

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

    const [sortVisible, setSortVisible] = useState(false);
    function sortVisHandler() {
        setSortVisible(prev => !prev);
    }

    const [sortAscending, setSortAscending] = useState(true);
    const [sorter, setSorter] = useState('level-id');
    function handleSortMenu(e) {
        setSorter(e.target.id);
    }
    function handleSortDiretion(e) {
        setSortAscending(e.target.id === 'asc');
    }



    //
    // Filter levels
    //
    const [filters, setFilters] = useState({ lowTier: '', highTier: '', difficulty: 0, removeUnrated: false, creator: '', song: '' });
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState();
    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            // Runs a little after user input stops
            let q = `${serverIP}/getLevels?page=${pageIndex}&name=${search}&sort=${sorter}_${sortAscending ? 'asc' : 'desc'}&`;
            for (let p of Object.keys(filters)) {
                q += p + '=' + filters[p] + '&';
            }
            q = encodeURI(q);

            fetch(q, {
                credentials: 'include'
            }).then(res => res.json()).then(data => {
                setLoaderResponse({ error: false, data })
            }).catch(e => {
                setLoaderResponse({ error: true, message: 'Couldn\'t connect to the sever!' });
            });
        }, 200));
    }, [search, filters, pageIndex, sorter, sortAscending]);

    useEffect(() => {
        setPageIndex(0);
    }, [search, filters]);



    const [showFilter, setShowFilter] = useState(false);
    function toggleShowFilter() {
        setShowFilter(prev => !prev);
    }

    function onSearchChange(event) {
        setSearch(event.target.value);
    }

    const [listView, setListView] = useState(true);
    function onViewList() {
        if (!listView) setListView(true);
    }

    function onViewGrid() {
        if (listView) setListView(false);
    }

    return (
        <div className='container'>
            <h1>
                The Ladder
            </h1>
            <div className='d-flex'>
                <div className='flex-fill m-2'>
                    <input type='text' placeholder='Search level name or ID...' className='form-control' name='query' value={search} onChange={onSearchChange} />
                </div>
                <ul className='d-flex list-options'>
                    <li>
                        <button className='btn btn-light btn-sm m-1 px-3 h-100' onClick={toggleShowFilter}>
                            <img src={filterEmpty} alt='' />
                        </button>
                    </li>
                    <li>
                        <div className='position-relative h-100'>
                            <button className='btn btn-light btn-sm m-1 px-3 h-100' onClick={sortVisHandler}>
                                <img src={sortAscending ? sortUp : sort} alt='' />
                            </button>
                            <div className={(sortVisible ? 'collapse-open' : 'collapse-close') + ' collapsable sortMenu'}>
                                <div className='option d-flex'>
                                    <div>
                                        <input type='radio' id='asc' name='asc' checked={sortAscending} onChange={handleSortDiretion} />
                                        <label htmlFor='asc'>Asc</label>
                                    </div>
                                    <div>
                                        <input type='radio' id='desc' name='asc' checked={!sortAscending} onChange={handleSortDiretion} />
                                        <label htmlFor='desc'>Desc</label>
                                    </div>
                                </div>
                                <div className='divider'></div>
                                <div className='option'>
                                    <input type='radio' id='name' name='sort' onChange={handleSortMenu} />
                                    <label htmlFor='name'>Name</label>
                                </div>
                                <div className='option'>
                                    <input type='radio' id='level-id' name='sort' checked={sorter === 'level-id'} onChange={handleSortMenu} />
                                    <label htmlFor='level-id'>Level ID</label>
                                </div>
                                <div className='option'>
                                    <input type='radio' id='tier' name='sort' onChange={handleSortMenu} />
                                    <label htmlFor='tier'>Tier</label>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='d-flex align-items-center m-1 h-100'>
                            <button className={'list view-left ' + (listView ? 'active' : '')} onClick={onViewList}>
                                <img src={listSVG} alt='' />
                            </button>
                            <button className={'list view-right ' + (!listView ? 'active' : '')} onClick={onViewGrid}>
                                <img src={gridSVG} alt='' />
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
            <FilterMenu show={showFilter} filter={setFilters} sessionID={sessionID} />
            <div id='levelList' className='my-3'>
                <Level info={{ Name: 'Level Name', Song: 'Song', Creator: 'Creator', ID: 'Level ID', Rating: 'Tier', isHeader: true}} key={-1} classes='head' />
                {!loaderResponse.error ? levels.levels.map(l => <Level info={l} key={l.ID} />)
                : <h1 className='m-5'>{loaderResponse.message}</h1>}
            </div>
            <div className='row align-items-center my-4 mx-5'>
                <button className='page-scroller col' onClick={pageDown}><img src={caretL} alt='' /></button>
                <p className='col text-center m-0 fs-3'>{pageIndex + 1} / {Math.ceil(levels.count/15) || 0}</p>
                <button className='page-scroller col' onClick={pageUp}><img src={caretR} alt='' /></button>
            </div>
        </div>
    );
}