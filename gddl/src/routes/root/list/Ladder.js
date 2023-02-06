import React, { useState } from 'react';
import { useLoaderData, Form } from 'react-router-dom';
import Level from './Level';
import filterEmpty from '../../../filter-empty.svg';
import sort from '../../../sort.svg';
import sortUp from '../../../sort-up.svg';
import caretR from '../../../caret-r.svg';
import caretL from '../../../caret-l.svg';

export async function ladderLoader() {
    return fetch('http://localhost:8080/search?tier=15&range=30')
    .then((res) => res.json())
    .catch((e) => {
        if (e.message == 'Failed to fetch') return { error: true, message: 'It looks like the servers are down :( Try again later!'};
        throw e;
    });
}

export default function Ladder() {
    const [levels] = useState(useLoaderData());
    const [filteredLevels, setFilteredLevels] = useState(levels);

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
        sortLevels(e.target.id, sortAscending);
    }

    function sortLevels(s, a) {
        let levelsCopy = [...filteredLevels];
        let dir = a ? 1 : -1;
        switch (s) {
            case 'name':
                levelsCopy.sort((a, b) => {
                    if (a.Name < b.Name) return -dir
                    if (a.Name > b.Name) return dir
                    return 0;
                });
                break;
            case 'tier':
                levelsCopy.sort((a, b) => {
                    if (a.Rating < b.Rating) return -dir
                    if (a.Rating > b.Rating) return dir
                    return 0;
                });
                break;
            default:  // Also used if id is 'level-id'
                levelsCopy.sort((a, b) => {
                    if (a.ID < b.ID) return -dir
                    if (a.ID > b.ID) return dir
                    return 0;
                });
                break;
        }
        setFilteredLevels(levelsCopy);
        setPages(sliceLevels(levelsCopy));
    }

    function handleSortDiretion(e) {
        setSortAscending(e.target.id === 'asc');

        // Re-sort
        sortLevels(sorter, e.target.id === 'asc');
    }

    // Filters levels depending on the search term
    function searchChange(e) {
        let search = e.target.value.toLowerCase();
        if (!search) {
            setFilteredLevels(levels);
            setPages(sliceLevels(levels));
            return;
        }

        let levelsCopy = [...levels];
        let res = levelsCopy.filter(el => { return (el.Name.toLowerCase().includes(search)) || (parseInt(el.ID) == search) || ((el.ID+'').includes(search)) });

        setFilteredLevels(res);
        let sliced = sliceLevels(res);
        setPages(sliced);
        if (sliced.length-1 <= pageIndex) setPageIndex(0);
    }

    return (
        <>
        <div className='my-5 row'>
            <h1>
                The Ladder
            </h1>
            <Form className='col m-2' id='search-form' role='search' action='/level'>
                <input type='text' placeholder='Search level name or ID...' className='form-control' name='query' onChange={searchChange} />
            </Form>
            <button className='col-1 btn btn-light m-2'>
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
                            <input type='radio' id='level-id' name='sort' checked={sorter == 'level-id'} onChange={handleSortMenu} />
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
        <div id='levelList' className='my-3'>
            <Level info={{ Name: 'Level Name', Creator: 'Creator', ID: 'Level ID', Rating: 'Tier', isHeader: true}} key={-1} />
            {!levels.error ? (pages.length > 0 ? pages[pageIndex].map(l => (
                <Level info={l} key={l.ID} />
            )) : '') : <h1 className='m-5'>{levels.message}</h1>}
        </div>
        <div className='row align-items-center my-4 mx-5'>
            <button className='pageScroller col' onClick={pageDown}><img src={caretL} alt='' /></button>
            <p className='col text-center m-0 fs-3'>{pageIndex + 1} / {pages.length}</p>
            <button className='pageScroller col' onClick={pageUp}><img src={caretR} alt='' /></button>
        </div>
        </>
    );
}