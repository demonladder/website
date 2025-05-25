import { useCallback, useEffect, useState } from 'react';
import Level, { Header } from '../../components/Level';
import Filters from './components/Filters';
import SortMenu from './components/SortMenu';
import SearchLevels from '../../api/level/SearchLevels';
import { useQuery } from '@tanstack/react-query';
import PageButtons from '../../components/PageButtons';
import { GridLevel } from '../../components/GridLevel';
import useSessionStorage from '../../hooks/useSessionStorage';
import { BooleanParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { useLazyQueryParam } from '../../hooks/useLazyQueryParam';
import { stripFalsyProperties } from '../../utils/stripFalsyProperties';
import LoadingSpinner from '../../components/LoadingSpinner';
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

// TODO: Expand filters to include all filters from the level search page
interface SavedFilters {
    [QueryParamNames.Name]: string;
    [QueryParamNames.Page]: number;
}

export default function Search() {
    const [savedFilters, setSavedFilters] = useSessionStorage<Partial<SavedFilters>>('levelFilters', {});

    const [name, lazyName, setName] = useLazyQueryParam(QueryParamNames.Name, savedFilters[QueryParamNames.Name] ?? '');
    const [creator, lazyCreator, setCreator] = useLazyQueryParam(QueryParamNames.Creator, '');
    const [song, lazySong, setSong] = useLazyQueryParam(QueryParamNames.Song, '');

    const [query, setQuery] = useQueryParams({
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
        [QueryParamNames.TwoPlayer]: BooleanParam,
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
        setQuery(savedFilters, 'replace');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateQ = useCallback((name: string, creator: string, song: string) => {
        return {
            ...stripFalsyProperties({
                name,
                creator,
                song,
            }),
            page: query.page,
            sort: query.sort,
            sortDirection: query.dir,
            minRating: query.r,
            maxRating: query.R,
            minEnjoyment: query.e,
            maxEnjoyment: query.E,
            difficulty: query[QueryParamNames.Difficulty],
            length: query[QueryParamNames.Length],
            minSubmissionCount: query[QueryParamNames.MinSubmissionCount],
            maxSubmissionCount: query[QueryParamNames.MaxSubmissionCount],
            minEnjoymentCount: query[QueryParamNames.MinEnjoymentCount],
            maxEnjoymentCount: query[QueryParamNames.MaxEnjoymentCount],
            minDeviation: query[QueryParamNames.MinDeviation],
            maxDeviation: query[QueryParamNames.MaxDeviation],
            minID: query[QueryParamNames.MinID],
            maxID: query[QueryParamNames.MaxID],
            twoPlayer: query[QueryParamNames.TwoPlayer],
            topSkillset: query[QueryParamNames.TopSkillset],
            excludeCompleted: query[QueryParamNames.ExcludeCompleted],
            excludeUnrated: query[QueryParamNames.ExcludeUnrated],
            excludeUnratedEnjoyment: query[QueryParamNames.ExcludeUnratedEnjoyment],
            excludeRated: query[QueryParamNames.ExcludeRated],
            excludeRatedEnjoyment: query[QueryParamNames.ExcludeRatedEnjoyment],
            isInPack: query[QueryParamNames.InPack],
        };
    }, [query]);

    function reset() {
        setSavedFilters({});
        setQuery({}, 'replace');
    }

    const [q, setQ] = useSessionStorage('searchQuery', generateQ(name, creator, song));
    const [showFilters, setShowFilters] = useSessionStorage('showFilters', false);
    const [isListView, setIsListView] = useLocalStorage('search.listView', true);

    useEffect(() => {
        setQ(generateQ(lazyName, lazyCreator, lazySong));
    }, [generateQ, lazyName, lazyCreator, lazySong, setQ]);

    const { status: searchStatus, data: searchData } = useQuery({
        queryKey: ['search', q],
        queryFn: () => SearchLevels(q),
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
        setSavedFilters((prev) => ({
            ...prev,
            [QueryParamNames.Name]: lazyName,
            [QueryParamNames.Creator]: lazyCreator,
            [QueryParamNames.Song]: lazySong,
        }));
    }, [lazyCreator, lazyName, lazySong, query, setSavedFilters]);

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
        setQuery({ ...query, [QueryParamNames.Page]: 0 });
    }

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
            }
        }
    }

    return (
        <Page>
            <Helmet>
                <title>GDDL | Search</title>
            </Helmet>
            <Heading1 className='mb-2'>Levels</Heading1>
            <div className='flex gap-4 items-center'>
                <SearchInput onKeyDown={onKeyDown} value={name} onChange={onNameChange} onMenu={() => setShowFilters((prev) => !prev)} placeholder='Search level...' />
            </div>
            <Filters creator={creator} setCreator={setCreator} song={song} setSong={setSong} reset={reset} show={showFilters} />
            <div className='flex justify-between mt-4'>
                <SortMenu />
                <ViewType isList={isListView!} onViewList={() => setIsListView(true)} onViewGrid={() => setIsListView(false)} />
            </div>
            <LoadingSpinner isLoading={searchStatus === 'loading'} />
            {searchStatus === 'error' && <Heading2 className='text-center'>An error occurred while searching</Heading2>}
            {searchStatus === 'success' &&
                <div className='my-4'>{searchData.levels.length !== 0 && isListView
                    ? <LevelRenderer element={Level} levels={searchData.levels} selectedLevel={selection} className='level-list' header={<Header />} />
                    : <LevelRenderer element={GridLevel} levels={searchData.levels} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2' />
                }</div>
            }
            {searchData && <PageButtons onPageChange={(page) => setQuery({ [QueryParamNames.Page]: page })} meta={{ ...searchData, page: query.page }} />}
            {searchData !== undefined && <p className='text-center'><b>{searchData.total}</b> level{pluralS(searchData.total)} found</p>}
        </Page>
    );
}
