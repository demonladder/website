import { useCallback, useEffect } from 'react';
import Level from '../../../components/Level';
import FilterMenu from './FilterMenu';
import SortMenu from './SortMenu';
import SearchLevels from '../../../api/level/SearchLevels';
import { useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import { TextInput } from '../../../components/Input';
import PageButtons from '../../../components/PageButtons';
import { GridLevel } from '../../../components/GridLevel';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { BooleanParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { useLazyQueryParam } from '../../../hooks/useLazyQueryParam';
import { stripFalsyProperties } from '../../../utils/stripFalsyProperties';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { QueryParamNames } from './QueryParamNames';
import { LevelRenderer } from '../../../components/LevelRenderer';
import useLevelView from '../../../hooks/useLevelView';

export default function Search() {
    const [name, lazyName, setName] = useLazyQueryParam(QueryParamNames.Name, '');
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
        setQuery({}, 'replace');
    }

    const [q, setQ] = useSessionStorage('searchQuery', generateQ(name, creator, song));
    const [showFilters, setShowFilters] = useSessionStorage('showFilters', false);
    const [listView, listViewButtons] = useLevelView('search.listView');

    useEffect(() => {
        setQ(generateQ(lazyName, lazyCreator, lazySong));
    }, [generateQ, lazyName, lazyCreator, lazySong, setQ]);

    const { status: searchStatus, data: searchData } = useQuery({
        queryKey: ['search', q],
        queryFn: () => SearchLevels(q),
    });

    useEffect(() => {
        if (searchData) {
            if (searchData.total < (query.page - 1) * searchData.limit) {
                setQuery({ ...query, page: 0 });
            }
        }
    }, [searchData, query, setQuery]);

    if (searchStatus === 'error') return <h2>An error ocurred!</h2>;

    return (
        <main className='my-4'>
            <Container className='bg-gray-800'>
                <h1 className='text-4xl mb-2'>The Ladder</h1>
                <div className='flex items-center gap-1'>
                    <div className='relative flex-grow group'>
                        <TextInput autoFocus placeholder='Search level name...' value={name} onChange={(e) => { setName(e.target.value); setQuery({ ...query, [QueryParamNames.Page]: 0 }) }} />
                        <button className='absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity' onClick={() => setName('')}>
                            <svg width='16' height='16' stroke='currentColor' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'>
                                <path strokeWidth='2' strokeLinecap='round' d='M4 4l22 22M4 26l22 -22' />
                            </svg>
                        </button>
                    </div>
                    <button className='bg-white text-black w-7 h-7 grid place-items-center' onClick={() => setShowFilters((prev: boolean) => !prev)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px' fill='currentColor' viewBox='0 0 16 16'>
                            <path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z' />
                        </svg>
                    </button>
                    <SortMenu />
                    {listViewButtons}
                </div>
                <FilterMenu creator={creator} setCreator={setCreator} song={song} setSong={setSong} reset={reset} show={showFilters} />
                <div className='my-4'>
                    {(searchStatus === 'loading' && !searchData)
                        ? <LoadingSpinner />
                        : searchData.levels.length === 0
                            ? <h2 className='text-3xl'>No levels found!</h2>
                            : listView
                                ? <LevelRenderer element={Level} levels={searchData.levels} className='level-list' header={<Level.Header />} />
                                : <LevelRenderer element={GridLevel} levels={searchData.levels} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2' />
                    }
                </div>
                {searchData && <PageButtons onPageChange={(page) => setQuery({ [QueryParamNames.Page]: page })} meta={{ ...searchData, page: query.page }} />}
            </Container>
        </main>
    );
}
