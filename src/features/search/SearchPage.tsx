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
import { TextInput } from '../../components/Input';
import IconButton from '../../components/input/buttons/icon/IconButton';
import { useShortcut } from 'react-keybind';

// TODO: Expand filters to include all filters from the level search page
interface SavedFilters {
    [QueryParamNames.Name]: string;
    [QueryParamNames.Page]: number;
}

export default function Search() {
    const [savedFilters, setSavedFilters] = useSessionStorage<Partial<SavedFilters>>('levelFilters', {});
    const [limit, setLimit] = useLocalStorage('searchLimit', 16);

    const [query, setQuery] = useQueryParams({
        [QueryParamNames.Name]: withDefault(StringParam, savedFilters[QueryParamNames.Name] ?? ''),
        [QueryParamNames.Creator]: withDefault(StringParam, ''),
        [QueryParamNames.Song]: withDefault(StringParam, ''),
        [QueryParamNames.Page]: withDefault(NumberParam, 0),
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
        if (params.size === 0) setQuery(savedFilters, 'replace');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function reset() {
        setSavedFilters({});
        setQuery({}, 'replace');
    }

    const [showFilters, setShowFilters] = useSessionStorage('showFilters', false);
    const [isListView, setIsListView] = useLocalStorage('search.listView', true);

    const { status: searchStatus, data: searchData, refetch: onSearch } = useQuery({
        queryKey: ['search', query],
        queryFn: () => getLevels(query),
        enabled: false,
    });

    // Reset page to 0 if the search data is empty and the page is greater than 0
    useEffect(() => {
        if (searchData) {
            if (searchData.total < (query.page - 1) * searchData.limit) {
                setQuery({ ...query, page: 0 });
            }

            setSelection(0);
        }
    }, [searchData, query, setQuery]);

    // Persist filters to session storage
    useEffect(() => {
        setSavedFilters(query);
    }, [query, setSavedFilters]);

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery({
            ...query,
            [QueryParamNames.Name]: e.target.value,
            [QueryParamNames.Page]: 0,
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

    return (
        <Page>
            <Helmet>
                <title>GDDL | Search</title>
            </Helmet>
            <Heading1 className='mb-2'>Levels</Heading1>
            <div className='flex gap-2 items-center'>
                <SearchInput ref={searchInputRef} onKeyDown={onKeyDown} value={query[QueryParamNames.Name]} onChange={onNameChange} onMenu={() => setShowFilters((prev) => !prev)} autoFocus placeholder='Search level...' />
                <IconButton color='filled' onClick={() => void onSearch()}><i className='bx bx-search' /></IconButton>
            </div>
            <Filters reset={reset} show={showFilters} />
            <div className='flex flex-wrap justify-between mt-4 gap-2'>
                <SortMenu />
                <div className='flex items-center gap-2'>
                    <p>Results per page:</p>
                    <TextInput value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} min='1' max='25' style={{ width: '3rem' }} className='text-center' />
                    <ViewType isList={isListView!} onViewList={() => setIsListView(true)} onViewGrid={() => setIsListView(false)} />
                </div>
            </div>
            {searchStatus === 'error' && <Heading2 className='text-center'>An error occurred while searching</Heading2>}
            {searchStatus === 'pending' &&
                <div>
                    {Array.from({ length: limit ?? 16 }, (_, i) => (
                        <LevelSkeleton key={`${i}`} />
                    ))}
                </div>
            }
            {searchStatus === 'success' && <>
                <div className='my-4'>{searchData.levels.length !== 0 && isListView
                    ? <LevelRenderer element={Level} levels={searchData.levels} selectedLevel={selection} />
                    : <LevelRenderer element={GridLevel} levels={searchData.levels} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2' />
                }</div>
                <PageButtons onPageChange={(page) => setQuery({ [QueryParamNames.Page]: page })} meta={{ ...searchData, page: query.page }} />
                <p className='text-center'><b>{searchData.total}</b> level{pluralS(searchData.total)} found</p>
            </>}
        </Page>
    );
}
