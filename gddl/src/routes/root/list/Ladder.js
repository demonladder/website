import React, { useState, useEffect } from 'react';
import { useLoaderData, Form, useOutletContext, useParams } from 'react-router-dom';
import Level from './Level';
import filterEmpty from '../../../icons/filter-empty.svg';
import FilterMenu from './FilterMenu';
import sort from '../../../icons/sort.svg';
import sortUp from '../../../icons/sort-up.svg';
import caretR from '../../../icons/caret-r.svg';
import caretL from '../../../icons/caret-l.svg';
import listSVG from '../../../icons/list.svg';
import gridSVG from '../../../icons/grid.svg';

export async function ladderLoader({ params }) {
    return fetch('http://localhost:8080/getLevels')
    .then((res) => res.json())
    .catch((e) => {
        if (e.message === 'Failed to fetch') return { error: true, message: 'It looks like the servers are down :( Try again later!'};
        throw e;
    });
}

export default function Ladder() {
    const [sessionID] = useOutletContext();

    const { creator } = useParams();

    const [levels] = useState(useLoaderData());
    const [filteredLevels, setFilteredLevels] = useState(levels);
    const [sortedLevels, setSortedLevels] = useState(levels);

    const [pageIndex, setPageIndex] = useState(0);

    let maxPerPage = 15;
    function sliceLevels(lvls) {
        let pagesCopy = [];
        for (let i = 0; i < lvls.length / maxPerPage; i++) {
            pagesCopy.push(lvls.slice(i*maxPerPage, (i+1)*maxPerPage));
        }
        return pagesCopy;
    }
    const [pages, setPages] = useState((levels && !levels.error) ? sliceLevels(levels) : []);


    const pageUp = () => {
        if (pageIndex + 1 < pages.length) {
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

    function sortLevels() {
        if (!levels.error) {
            let levelsCopy = [...filteredLevels];
            switch (sorter) {
                case 'name':
                    levelsCopy.sort((a, b) => {
                        if (a.Name < b.Name) return -1
                        if (a.Name > b.Name) return 1
                        return 0;
                    });
                    break;
                case 'tier':
                    levelsCopy.sort((a, b) => {
                        if (a.Rating < b.Rating) return -1
                        if (a.Rating > b.Rating) return 1
                        return 0;
                    });
                    break;
                default:  // Also used if id is 'level-id'
                    levelsCopy.sort((a, b) => {
                        if (a.ID < b.ID) return -1
                        if (a.ID > b.ID) return 1
                        return 0;
                    });
                    break;
            }
            if (!sortAscending) levelsCopy.reverse();
            setSortedLevels(levelsCopy);
        } else {
            setSortedLevels([]);
        }
    }

    function handleSortDiretion(e) {
        setSortAscending(e.target.id === 'asc');
    }

    // Filter levels
    const [filters, setFilters] = useState({ lowTier: '', highTier: '', difficulty: 0, creator: '', song: '' });
    const [search, setSearch] = useState('');
    useEffect(() => {
        if (!levels.error) {
            let levelsCopy = [...levels];
            if (search) levelsCopy = levelsCopy.filter(el => { return (el.Name.toLowerCase().includes(search.toLowerCase())) 
                                                        || (parseInt(el.ID) === search)
                                                        || ((el.ID+'').includes(search)) });
            
            let hTier = !filters.highTier ? filters.lowTier + 1 : filters.highTier;  // If high tier is empty, it will default to low tier + 1
            if (filters.creator !== '') levelsCopy = levelsCopy.filter(el => el.Creator.toLowerCase().includes(filters.creator.toLowerCase()));
            if (filters.lowTier !== '') levelsCopy = levelsCopy.filter(el => el.Rating >= filters.lowTier && el.Rating < hTier);
            if (filters.difficulty !== 0) levelsCopy = levelsCopy.filter(el => el.Difficulty === filters.difficulty);
            if (filters.song !== '') levelsCopy = levelsCopy.filter(el => el.Song.toLowerCase().includes(filters.song.toLowerCase()));
            levelsCopy = levelsCopy.filter(el => (el.Rating === -1 && filters.removeUnrated) ? false : true);

            setFilteredLevels(levelsCopy);
        } else {
            setFilteredLevels([]);
        }
    }, [search, filters]);

    const [showFilter, setShowFilter] = useState(false);
    function toggleShowFilter() {
        setShowFilter(prev => !prev);
    }

    useEffect(() => {
        sortLevels();
    }, [sorter, sortAscending, filteredLevels]);

    useEffect(() => {  // Updates pages so it matches filteredLevels
        let sliced = sliceLevels(sortedLevels);
        setPages(sliced);
        if (sliced.length-1 <= pageIndex) setPageIndex(0);
    }, [sortedLevels]);

    function onSearchChange(event) {
        setSearch(event.target.value);
    }

    const [creatorState, setCreator] = useState(creator || '');

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
                <Form className='flex-fill m-2' id='search-form' role='search' action='/level'>
                    <input type='text' placeholder='Search level name or ID...' className='form-control' name='query' value={search} onChange={onSearchChange} />
                </Form>
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
            <FilterMenu show={showFilter} filter={setFilters} sessionID={sessionID} creator={creatorState} setCreator={setCreator} />
            <div id='levelList' className='my-3'>
                <Level info={{ Name: 'Level Name', Song: 'Song', Creator: 'Creator', ID: 'Level ID', Rating: 'Tier', isHeader: true}} key={-1} classes='head' />
                {!levels.error ? (pages.length > 0 ? pages[pageIndex].map(l => (
                    <Level info={l} key={l.ID} />
                )) : '') : <h1 className='m-5'>{levels.message}</h1>}
            </div>
            <div className='row align-items-center my-4 mx-5'>
                <button className='page-scroller col' onClick={pageDown}><img src={caretL} alt='' /></button>
                <p className='col text-center m-0 fs-3'>{pageIndex + 1} / {pages.length}</p>
                <button className='page-scroller col' onClick={pageUp}><img src={caretR} alt='' /></button>
            </div>
        </div>
    );
}