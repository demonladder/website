import React, { useEffect, useState } from 'react';
import sort from '../../../icons/sort.svg';
import sortUp from '../../../icons/sort-up.svg';

export function toggleSortMenu() {
    const content = document.getElementById('sort-menu');

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
    }
}

export function closeSortMenu() {
    const content = document.getElementById('sort-menu');
    if (content.style.maxHeight) content.style.maxHeight = null;
}

export default function SortMenu({ set }) {
    const [sortAscending, setSortAscending] = useState(true);
    const [sorter, setSorter] = useState('level-id');
    function handleSortMenu(e) {
        setSorter(e.target.id);
    }

    useEffect(() => {
        set({
            sortDirection: sortAscending ? 'asc' : 'desc',
            sort: sorter
        });
    }, [sortAscending, sorter]);

    return (        
        <div className='position-relative h-100'>
            <button className='btn btn-light btn-sm px-3 h-100' onClick={toggleSortMenu}>
                <img src={sortAscending ? sortUp : sort} alt='' />
            </button>
            <div id='sort-menu'>
                <div className='content'>
                    <div className='direction'>
                        <div>
                            <label htmlFor='asc'>
                                <input type='radio' id='asc' name='asc' checked={sortAscending} onChange={() => setSortAscending(true)} />
                                Asc
                            </label>
                        </div>
                        <div>
                            <label htmlFor='desc'>
                                <input type='radio' id='desc' name='asc' checked={!sortAscending} onChange={() => setSortAscending(false)} />
                                Desc
                            </label>
                        </div>
                    </div>
                    <div className='divider'></div>
                    <div className='sort-by-options'>
                        <div>
                            <b>Sort by</b>
                        </div>
                        <div className='option'>
                            <label htmlFor='name' className='p-0'>
                                <input type='radio' id='name' name='sort' checked={sorter ==='name'} onChange={handleSortMenu} />
                                Name
                            </label>
                        </div>
                        <div className='option'>
                            <label htmlFor='level-id' className='p-0'>
                                <input type='radio' id='level-id' name='sort' checked={sorter ==='level-id'} onChange={handleSortMenu} />
                                Level ID
                            </label>
                        </div>
                        <div className='option'>
                            <label htmlFor='tier' className='p-0'>
                                <input type='radio' id='tier' name='sort' checked={sorter ==='tier'} onChange={handleSortMenu} />
                                Tier
                            </label>
                        </div>
                        <div className='option'>
                            <label htmlFor='tier' className='p-0'>
                                <input type='radio' id='enjoyment' name='sort' checked={sorter ==='enjoyment'} onChange={handleSortMenu} />
                                Enjoyment
                            </label>
                        </div>
                        <div className='option'>
                            <label htmlFor='tier' className='p-0'>
                                <input type='radio' id='ratings' name='sort' checked={sorter ==='ratings'} onChange={handleSortMenu} />
                                Rating count
                            </label>
                        </div>
                        <div className='option'>
                            <label htmlFor='tier' className='p-0'>
                                <input type='radio' id='enjoyments' name='sort' checked={sorter ==='enjoyments'} onChange={handleSortMenu} />
                                Enjoyment count
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}