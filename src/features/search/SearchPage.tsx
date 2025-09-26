import { useCallback, useEffect, useRef, useState } from 'react';
import Level, { LevelSkeleton } from '../../components/Level';
import Filters from './components/Filters';
import SortMenu from './components/SortMenu';
import { getLevels } from './api/getLevels';
import { useQuery } from '@tanstack/react-query';
import { GridLevel } from '../../components/GridLevel';
import useSessionStorage from '../../hooks/useSessionStorage';
import { BooleanParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { QueryParamNames } from './enums/QueryParamNames';
import { LevelRenderer } from '../../components/LevelRenderer';
import Heading1 from '../../components/headings/Heading1';
import Heading2 from '../../components/headings/Heading2';
import Page from '../../components/Page';
import { useNavigate } from 'react-router';
import SearchInput from '../../components/input/search/Search';
import pluralS from '../../utils/pluralS';
import IconButton from '../../components/input/buttons/icon/IconButton';
import { useShortcut } from 'react-keybind';
import { useApp } from '../../context/app/useApp';
import { LevelViewType } from '../../context/app/AppContext';
import PageButtons from '../../components/PageButtons';

// TODO: Expand filters to include all filters from the level search page
interface SavedFilters {
    [QueryParamNames.Name]: string | null;
}

export default function Search() {
    const [savedFilters, setSavedFilters] = useSessionStorage<Partial<SavedFilters>>('level-filters', {});
    const [showFilters, setShowFilters] = useSessionStorage('show-filters', false);
    const [page, setPage] = useState(0);
    const app = useApp();

    const [queryParams, setQueryParams] = useQueryParams({
        [QueryParamNames.Name]: StringParam,
        [QueryParamNames.Creator]: StringParam,
        [QueryParamNames.Song]: StringParam,
        [QueryParamNames.Sort]: withDefault(StringParam, 'ID'),
        [QueryParamNames.SortDirection]: withDefault(StringParam, 'asc'),
        [QueryParamNames.MinRating]: NumberParam,
        [QueryParamNames.MaxRating]: NumberParam,
        [QueryParamNames.MinEnjoyment]: NumberParam,
        [QueryParamNames.MaxEnjoyment]: NumberParam,
        [QueryParamNames.Difficulty]: StringParam,
        [QueryParamNames.Length]: NumberParam,
        [QueryParamNames.MinSubmissionCount]: NumberParam,
        [QueryParamNames.MaxSubmissionCount]: NumberParam,
        [QueryParamNames.MinEnjoymentCount]: NumberParam,
        [QueryParamNames.MaxEnjoymentCount]: NumberParam,
        [QueryParamNames.MinDeviation]: NumberParam,
        [QueryParamNames.MaxDeviation]: NumberParam,
        [QueryParamNames.MinID]: NumberParam,
        [QueryParamNames.MaxID]: NumberParam,
        [QueryParamNames.TwoPlayer]: StringParam,
        [QueryParamNames.Update]: StringParam,
        [QueryParamNames.TopSkillset]: StringParam,
        [QueryParamNames.ExcludeCompleted]: BooleanParam,
        [QueryParamNames.ExcludeUnrated]: BooleanParam,
        [QueryParamNames.ExcludeUnratedEnjoyment]: BooleanParam,
        [QueryParamNames.ExcludeRated]: BooleanParam,
        [QueryParamNames.ExcludeRatedEnjoyment]: BooleanParam,
        [QueryParamNames.InPack]: BooleanParam,
    });

    useEffect(() => {
        setQueryParams(savedFilters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { registerShortcut, unregisterShortcut } = useShortcut()!;
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const scrollToSearchInput = useCallback(() => {
        if (searchInputRef.current) {
            searchInputRef.current.scrollIntoView({ behavior: 'instant', block: 'center' });
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, []);

    // Register the shortcut to focus the search input
    useEffect(() => {
        const keybinds = ['ctrl+k', 'cmd+k'];
        registerShortcut(scrollToSearchInput, keybinds, 'Search', 'Search levels');
        return () => {
            unregisterShortcut(keybinds);
        };
    }, [registerShortcut, scrollToSearchInput, unregisterShortcut]);

    const onSearch = useCallback(() => {
        setSavedFilters(queryParams);
        setShowFilters(false);
    }, [queryParams, setSavedFilters, setShowFilters]);

    function reset() {
        setSavedFilters({});
        setQueryParams({}, 'replace');
    }

    const { status: searchStatus, data: searchData } = useQuery({
        queryKey: ['search', { ...savedFilters, difficulty: queryParams[QueryParamNames.Difficulty] ? queryParams[QueryParamNames.Difficulty] : undefined, sortDirection: queryParams[QueryParamNames.SortDirection], page }],
        queryFn: () => getLevels({ ...savedFilters, difficulty: queryParams[QueryParamNames.Difficulty] ? parseInt(queryParams[QueryParamNames.Difficulty]) - 1 : undefined, sortDirection: queryParams[QueryParamNames.SortDirection], page }),
    });

    function onNameChange(newName: string) {
        setQueryParams({
            ...queryParams,
            [QueryParamNames.Name]: newName,
        });
    }

    // Up and down arrow key navigation
    const [selection, setSelection] = useState(0);
    const navigate = useNavigate();
    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelection((prev) => Math.min(prev + 1, searchData?.levels.length ?? 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelection((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            if (selection > 0) {
                const level = searchData?.levels[selection - 1];
                if (level) {
                    void navigate('/level/' + level.ID);
                }
            } else {
                void onSearch();
            }
        }
    }

    return (
        <Page title='GDDL | Search'>
            <Heading1 className='mb-2'>Levels</Heading1>
            <div className='flex gap-2 items-center transition-all'>
                <SearchInput ref={searchInputRef} onKeyDown={onKeyDown} value={queryParams[QueryParamNames.Name] ?? ''} onChange={(e) => onNameChange(e.target.value.trimStart().slice(0, 22))} onMenu={() => setShowFilters((prev) => !prev)} autoFocus placeholder='Search by name or ID' />
                <IconButton color='filled' onClick={() => void onSearch()}><i className='bx bx-search' /></IconButton>
            </div>
            <Filters reset={reset} show={showFilters} />
            <SortMenu />
            {searchStatus === 'error' && <Heading2 className='text-center'>An error occurred while searching</Heading2>}
            {searchStatus === 'pending' &&
                <div className='my-4'>
                    {Array.from({ length: 12 }, (_, i) => (
                        <LevelSkeleton key={i} />
                    ))}
                </div>
            }
            {searchStatus === 'success' && <>
                {searchData.levels && app.levelViewType === LevelViewType.LIST
                    ? <LevelRenderer element={Level} levels={searchData.levels} selectedLevel={selection} className='my-2' />
                    : <LevelRenderer element={GridLevel} levels={searchData.levels} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-2' selectedLevel={selection} />
                }
                <div className='my-4'>
                    <PageButtons meta={{ total: searchData.total, page, limit: 16 }} onPageChange={setPage} />
                    <p className='text-center'><b>{searchData.total}</b> level{pluralS(searchData.total)} found</p>
                </div>
            </>}
        </Page>
    );
}
