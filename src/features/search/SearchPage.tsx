import { useCallback, useEffect, useRef, useState } from 'react';
import Level, { LevelSkeleton } from '../../components/Level';
import Filters from './components/Filters';
import SortMenu from './components/SortMenu';
import { getLevels } from './api/getLevels';
import { useQuery } from '@tanstack/react-query';
import PageButtons from '../../components/PageButtons';
import { GridLevel } from '../../components/GridLevel';
import useSessionStorage from '../../hooks/useSessionStorage';
import { BooleanParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { QueryParamNames } from './enums/QueryParamNames';
import { LevelRenderer } from '../../components/LevelRenderer';
import Heading1 from '../../components/headings/Heading1';
import Heading2 from '../../components/headings/Heading2';
import { Helmet } from 'react-helmet-async';
import Page from '../../components/Page';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../../components/input/search/Search';
import ViewType from './components/ViewType';
import useLocalStorage from '../../hooks/useLocalStorage';
import pluralS from '../../utils/pluralS';
import { NumberInput } from '../../components/Input';
import IconButton from '../../components/input/buttons/icon/IconButton';
import { useShortcut } from 'react-keybind';

// TODO: Expand filters to include all filters from the level search page
interface SavedFilters {
    [QueryParamNames.Name]: string | null;
}

export default function Search() {
    const [savedFilters, setSavedFilters] = useSessionStorage<Partial<SavedFilters>>('levelFilters', {});
    const [page, setPage] = useSessionStorage('level-search-page', 0);
    const [limit, setLimit] = useSessionStorage('level-search-limit', 12);
    const [limitDisplay, setLimitDisplay] = useState<string | number>(limit);

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
        [QueryParamNames.Difficulty]: NumberParam,
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

    // Load state from the URL search parameters on initial mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.size === 0) setQueryParams(savedFilters, 'replace');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function reset() {
        setSavedFilters({});
        setQueryParams({}, 'replace');
    }

    const [showFilters, setShowFilters] = useSessionStorage('showFilters', false);
    const [isListView, setIsListView] = useLocalStorage('search.listView', true);

    const { status: searchStatus, data: searchData } = useQuery({
        queryKey: ['search', { ...savedFilters, limit, page }],
        queryFn: () => getLevels({ ...savedFilters, limit, page }),
    });

    const onSearch = useCallback(() => {
        setSavedFilters(queryParams);
    }, [queryParams, setSavedFilters]);

    // Reset page to 0 if the search data is empty and the page is greater than 0
    useEffect(() => {
        if (searchData) {
            if (searchData.total < (page) * searchData.limit) {
                setPage(0);
            }

            setSelection(0);
        }
    }, [searchData, queryParams, setQueryParams, page, setPage]);

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
                    navigate('/level/' + level.ID);
                }
            } else {
                void onSearch();
            }
        }
    }

    // useEffect(() => {
    //     void onSearch();
    // }, [onSearch, page, limit]);

    function onLimitChange(e: React.ChangeEvent<HTMLInputElement>) {
        const parsed = parseInt(e.target.value);
        if (isNaN(parsed) || parsed < 1 || parsed > 25) {
            setLimitDisplay(limit);
            return;
        }
        setLimit(parsed);
    }

    return (
        <Page>
            <Helmet>
                <title>GDDL | Search</title>
            </Helmet>
            <Heading1 className='mb-2'>Levels</Heading1>
            <div className='flex gap-2 items-center transition-all'>
                <SearchInput ref={searchInputRef} onKeyDown={onKeyDown} value={queryParams[QueryParamNames.Name] ?? ''} onChange={(e) => onNameChange(e.target.value)} onMenu={() => setShowFilters((prev) => !prev)} autoFocus placeholder='Search by name or ID' />
                <IconButton color='filled' onClick={() => void onSearch()}><i className='bx bx-search' /></IconButton>
            </div>
            <Filters reset={reset} show={showFilters} />
            <div className='flex flex-wrap justify-between mt-4 gap-2 transition-opacity'>
                <SortMenu />
                <div className='flex items-center gap-2'>
                    <ViewType isList={isListView!} onViewList={() => setIsListView(true)} onViewGrid={() => setIsListView(false)} />
                </div>
            </div>
            {searchStatus === 'error' && <Heading2 className='text-center'>An error occurred while searching</Heading2>}
            {searchStatus === 'pending' &&
                <div className='my-4'>
                    {Array.from({ length: limit }, (_, i) => (
                        <LevelSkeleton key={i} />
                    ))}
                </div>
            }
            {searchStatus === 'success' && <>
                <div className='my-4'>{searchData.levels.length !== 0 && isListView
                    ? <LevelRenderer element={Level} levels={searchData.levels} selectedLevel={selection} />
                    : <LevelRenderer element={GridLevel} levels={searchData.levels} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2' />
                }</div>
                <PageButtons onPageChange={setPage} meta={{ ...searchData, page }} />
                <div className='flex items-center justify-center gap-2 my-2'>
                    <p>Per page:</p>
                    <NumberInput value={limitDisplay} onChange={(e) => setLimitDisplay(e.target.value)} onBlur={onLimitChange} min='1' max='25' style={{ width: '3rem' }} centered={true} disableSpinner={true} />
                </div>
                <p className='text-center'><b>{searchData.total}</b> level{pluralS(searchData.total)} found</p>
            </>}
        </Page>
    );
}
