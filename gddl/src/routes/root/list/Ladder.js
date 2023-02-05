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
    const [levels, setLevels] = useState(useLoaderData());

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
        let levelsCopy = [...levels];
        let dir = a ? 1 : -1;
        switch (s) {
            case 'name':
                levelsCopy.sort((a, b) => {
                    if (a.name < b.name) return -dir
                    if (a.name > b.name) return dir
                    return 0;
                });
                break;
            case 'tier':
                levelsCopy.sort((a, b) => {
                    if (a.rating < b.rating) return -dir
                    if (a.rating > b.rating) return dir
                    return 0;
                });
                break;
            default:  // Also used if id is 'level-id'
                levelsCopy.sort((a, b) => {
                    if (a.id < b.id) return -dir
                    if (a.id > b.id) return dir
                    return 0;
                });
                break;
        }
        setLevels(levelsCopy);
        setPages(sliceLevels(levelsCopy));
    }

    function handleSortDiretion(e) {
        setSortAscending(e.target.id === 'asc');

        // Re-sort
        sortLevels(sorter, e.target.id === 'asc');
    }

    return (
        <>
        <div className='my-5 row'>
            <Form className='col m-2' id='search-form' role='search' action='/level'>
                <input type='text' placeholder='Search level...' className='form-control' name='query' />
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
                            <input type='radio' id='level-id' name='sort' onChange={handleSortMenu} />
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
            <Level info={{ name: 'Level Name', creator: 'Creator', id: 'Level ID', rating: 'Tier', isHeader: true}} key={-1} />
            {!levels.error ? pages[pageIndex].map(l => (
                <Level info={l} key={l.id} />
            )) : <h1 className='m-5'>{levels.message}</h1>}
        </div>
        <div className='row align-items-center my-4 mx-5'>
            <button className='pageScroller col' onClick={pageDown}><img src={caretL} alt='' /></button>
            <p className='col text-center m-0 fs-3'>{pageIndex + 1} / {pages.length}</p>
            <button className='pageScroller col' onClick={pageUp}><img src={caretR} alt='' /></button>
        </div>
        </>
    );
}