import React, { useEffect, useState, useRef, useCallback } from 'react';
import { RadioButton } from '../../../components/Input';
import { Sorts } from '../api/getUserSubmissions';
import { useLocalStorage } from 'usehooks-ts';
import Divider from '../../../components/divider/Divider';

interface Props {
    set: (sort: { sort: Sorts, sortDirection: 'asc' | 'desc' }) => void;
}

export default function SortMenu({ set }: Props) {
    const [sortAscending, setSortAscending] = useLocalStorage('profile.submissions.sortAscending', true);
    const [sorter, setSorter] = useLocalStorage<Sorts>('profile.submissions.sortBy', Sorts.LEVEL_ID);
    const [show, setShow] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);

    function handleSortMenu(e: React.ChangeEvent<HTMLInputElement>) {
        setSorter(e.target.id as Sorts);
    }

    useEffect(() => {
        set({
            sortDirection: sortAscending ? 'asc' : 'desc',
            sort: sorter,
        });
    }, [sortAscending, sorter, set]);

    const mouseMove = useCallback((e: MouseEvent) => {  // Auto close sort menu when mouse wanders too far
        const menu = resultsRef.current;
        if (!menu) return;
        const rect = menu.getBoundingClientRect();
        const dist = 100;

        if (e.clientX < rect.x - dist ||
            e.clientX > rect.x + rect.width + dist ||
            e.clientY < rect.y - dist ||
            e.clientY > rect.y + rect.height + dist) {
            setShow(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', mouseMove);

        return () => {
            document.removeEventListener('mousemove', mouseMove);
        };
    }, [mouseMove]);

    return (
        <div className='relative h-full' style={{ zIndex: 60 }}>
            <button className='bg-white text-black w-7 h-7 grid place-items-center' onClick={() => setShow(prev => !prev)}>
                {sortAscending ?
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-sort-up' viewBox='0 0 16 16'>
                        <path d='M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z' />
                    </svg> :
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-sort-down' viewBox='0 0 16 16'>
                        <path d='M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z' />
                    </svg>
                }
            </button>
            <div ref={resultsRef} className='absolute left-1/2 -translate-x-1/2 grid overflow-hidden transition-[grid-template-rows]' style={{ gridTemplateRows: show ? '1fr' : '0fr' }}>
                <div className='min-h-0 bg-theme-600 w-max'>
                    <div className='p-3 flex flex-col gap-2'>
                        <div className='columns-2'>
                            <div>
                                <label htmlFor='asc' className='flex items-center gap-2 select-none'>
                                    <RadioButton id='asc' name='asc' checked={sortAscending} onChange={() => setSortAscending(true)} />
                                    Asc
                                </label>
                            </div>
                            <div>
                                <label htmlFor='desc' className='flex items-center gap-2 select-none'>
                                    <RadioButton id='desc' name='asc' checked={!sortAscending} onChange={() => setSortAscending(false)} />
                                    Desc
                                </label>
                            </div>
                        </div>
                        <Divider />
                        <div>
                            <b>Sort by</b>
                            <label htmlFor={Sorts.NAME} className='flex items-center gap-2 select-none'>
                                <RadioButton id={Sorts.NAME} name='sort' checked={sorter === Sorts.NAME} onChange={handleSortMenu} />
                                Name
                            </label>
                            <label htmlFor={Sorts.LEVEL_ID} className='flex items-center gap-2 select-none'>
                                <RadioButton id={Sorts.LEVEL_ID} name='sort' checked={sorter === Sorts.LEVEL_ID} onChange={handleSortMenu} />
                                Level ID
                            </label>
                            <label htmlFor={Sorts.RATING} className='flex items-center gap-2 select-none'>
                                <RadioButton id={Sorts.RATING} name='sort' checked={sorter === Sorts.RATING} onChange={handleSortMenu} />
                                Rating
                            </label>
                            <label htmlFor={Sorts.LEVEL_RATING} className='flex items-center gap-2 select-none'>
                                <RadioButton id={Sorts.LEVEL_RATING} name='sort' checked={sorter === Sorts.LEVEL_RATING} onChange={handleSortMenu} />
                                Level rating
                            </label>
                            <label htmlFor={Sorts.ENJOYMENT} className='flex items-center gap-2 select-none'>
                                <RadioButton id={Sorts.ENJOYMENT} name='sort' checked={sorter === Sorts.ENJOYMENT} onChange={handleSortMenu} />
                                Enjoyment
                            </label>
                            <label htmlFor={Sorts.LEVEL_ENJOYMENT} className='flex items-center gap-2 select-none'>
                                <RadioButton id={Sorts.LEVEL_ENJOYMENT} name='sort' checked={sorter === Sorts.LEVEL_ENJOYMENT} onChange={handleSortMenu} />
                                Level enjoyment
                            </label>
                            <label htmlFor={Sorts.RECENCY} className='flex items-center gap-2 select-none'>
                                <RadioButton id={Sorts.RECENCY} name='sort' checked={sorter === Sorts.RECENCY} onChange={handleSortMenu} />
                                Date added
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
