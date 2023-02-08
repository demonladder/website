import React, { useState, useEffect } from 'react';
import { useLoaderData, Form, useOutletContext } from 'react-router-dom';
import Level from './Level';
import filterEmpty from '../../../filter-empty.svg';
import FilterMenu from './FilterMenu';
import sort from '../../../sort.svg';
import sortUp from '../../../sort-up.svg';
import caretR from '../../../caret-r.svg';
import caretL from '../../../caret-l.svg';

export async function ladderLoader() {
    return fetch('http://localhost:8080/getLevels')
    .then((res) => res.json())
    .catch((e) => {
        if (e.message === 'Failed to fetch') return { error: true, message: 'It looks like the servers are down :( Try again later!'};
        throw e;
    });
}

export default function Ladder() {
    const [sessionID] = useOutletContext();

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

    return (
        <div className='container'>
            <div className='my-5 row'>
                <h1>
                    The Ladder
                </h1>
                <Form className='col m-2' id='search-form' role='search' action='/level'>
                    <input type='text' placeholder='Search level name or ID...' className='form-control' name='query' onChange={onSearchChange} />
                </Form>
                <button className='col-1 btn btn-light m-2' onClick={toggleShowFilter}>
                    <img src={filterEmpty} alt='' />
                </button>
                <div className='col-1 '>
                    <button className='btn btn-light m-2' onClick={sortVisHandler}>
                        <img src={sortAscending ? sortUp : sort} alt='' />
                    </button>
                    <div className={(sortVisible ? 'fadeIn' : 'invisible') + ' sortMenu'}>
                        <div className='option'>
                            <label>
                                <input type='radio' id='asc' name='asc' checked={sortAscending} onChange={handleSortDiretion} />
                                <span> Asc</span>
                            </label>
                            <label>
                                <input type='radio' id='desc' name='asc' checked={!sortAscending} onChange={handleSortDiretion} />
                                <span> Desc</span>
                            </label>
                        </div>
                        <div className='divider'></div>
                        <div className='option'>
                            <label>
                                <input type='radio' id='name' name='sort' onChange={handleSortMenu} />
                                <span className='mx-1'>Name</span>
                            </label>
                        </div>
                        <div className='option'>
                            <label>
                                <input type='radio' id='level-id' name='sort' checked={sorter === 'level-id'} onChange={handleSortMenu} />
                                <span className='mx-1'>Level ID</span>
                            </label>
                        </div>
                        <div className='option'>
                            <label>
                                <input type='radio' id='tier' name='sort' onChange={handleSortMenu} />
                                <span className='mx-1'>Tier</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <FilterMenu show={showFilter} filter={setFilters} sessionID={sessionID} />
            <div id='levelList' className='my-3'>
                <Level info={{ Name: 'Level Name', Song: 'Song', Creator: 'Creator', ID: 'Level ID', Rating: 'Tier', isHeader: true}} key={-1} />
                {!levels.error ? (pages.length > 0 ? pages[pageIndex].map(l => (
                    <Level info={l} key={l.ID} />
                )) : '') : <h1 className='m-5'>{levels.message}</h1>}
            </div>
            <div className='row align-items-center my-4 mx-5'>
                <button className='pageScroller col' onClick={pageDown}><img src={caretL} alt='' /></button>
                <p className='col text-center m-0 fs-3'>{pageIndex + 1} / {pages.length}</p>
                <button className='pageScroller col' onClick={pageUp}><img src={caretR} alt='' /></button>
            </div>
        </div>
    );
}