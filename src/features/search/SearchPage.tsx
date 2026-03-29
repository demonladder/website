import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LevelSkeleton } from '../../components/shared/Level';
import Filters from './components/Filters';
import SortMenu from './components/SortMenu';
import { getLevels } from './api/getLevels';
import { useQuery } from '@tanstack/react-query';
import useSessionStorage from '../../hooks/useSessionStorage';
import { BooleanParam, NumberParam, StringParam, useQueryParam, useQueryParams, withDefault } from 'use-query-params';
import { QueryParamNames } from './enums/QueryParamNames';
import { Heading1, Heading2 } from '../../components/headings';
import Page from '../../components/layout/Page';
import { useNavigate } from 'react-router';
import SearchInput from '../../components/input/search/Search';
import pluralS from '../../utils/pluralS';
import IconButton from '../../components/input/buttons/icon/IconButton';
import { useShortcut } from 'react-keybind';
import { useApp } from '../../context/app/useApp';
import { LevelViewType } from '../../context/app/AppContext';
import PageButtons from '../../components/shared/PageButtons';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { UserCard } from './components/UserCard';
import { useSearchUsers } from './hooks/useSearchUsers';
import { RangeFilterLabel } from './components/RangeFilterLabel.tsx';
import { FilterLabel } from './components/FilterLabel.tsx';
import { GridLevelPresenter, ListLevelPresenter } from './components/LevelPresenter.tsx';
import { Grid, List as ListIcon } from '@boxicons/react';

interface SavedFilters {
    [QueryParamNames.Name]: string | null;
    [QueryParamNames.MaxRating]: number | null;
    [QueryParamNames.MinRating]: number | null;
    [QueryParamNames.MaxEnjoyment]: number | null;
    [QueryParamNames.MinEnjoyment]: number | null;
    [QueryParamNames.Length]: keyof typeof lengths | null;
    [QueryParamNames.Difficulty]: keyof typeof difficulties | null;
    [QueryParamNames.MinSubmissionCount]: number | null;
    [QueryParamNames.MaxSubmissionCount]: number | null;
    [QueryParamNames.MinEnjoymentCount]: number | null;
    [QueryParamNames.MaxEnjoymentCount]: number | null;
}

type NumericFilterKeys = {
    [K in keyof SavedFilters]: SavedFilters[K] extends number | null ? K : never;
}[keyof SavedFilters];

const difficulties = {
    '1': 'official',
    '2': 'easy',
    '3': 'medium',
    '4': 'hard',
    '5': 'insane',
    '6': 'extreme',
};

const lengths = {
    1: 'tiny',
    2: 'short',
    3: 'medium',
    4: 'long',
    5: 'xl',
    6: 'platformer',
};

export default function Search() {
    const [savedFilters, setSavedFilters] = useSessionStorage<Partial<SavedFilters>>('level-filters', {});
    const [showFilters, setShowFilters] = useSessionStorage('show-filters', false);
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));
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
        [QueryParamNames.TopTagID]: StringParam,
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
            setTimeout(() => {
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
            }, 100);
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
        setSavedFilters(queryParams as typeof savedFilters);
        setShowFilters(false);
    }, [queryParams, setSavedFilters, setShowFilters]);

    function reset() {
        setSavedFilters({});
        setQueryParams({}, 'replace');
    }

    const { status: levelSearchStatus, data: levelSearchData } = useQuery({
        queryKey: [
            'searchLevels',
            {
                ...savedFilters,
                difficulty: queryParams[QueryParamNames.Difficulty]
                    ? queryParams[QueryParamNames.Difficulty]
                    : undefined,
                sort: queryParams[QueryParamNames.Sort],
                sortDirection: queryParams[QueryParamNames.SortDirection],
                page,
            },
        ],
        queryFn: () =>
            getLevels({
                ...savedFilters,
                difficulty: queryParams[QueryParamNames.Difficulty]
                    ? parseInt(queryParams[QueryParamNames.Difficulty]) - 1
                    : undefined,
                sort: queryParams[QueryParamNames.Sort],
                sortDirection: queryParams[QueryParamNames.SortDirection],
                page,
            }),
    });

    const [userPage, setUserPage] = useSessionStorage('user-search-page', 0);
    const searchUserOptions = useMemo(
        () => ({ name: savedFilters[QueryParamNames.Name], limit: 16, page: userPage }),
        [savedFilters, userPage],
    );
    const { status: userSearchStatus, data: userSearchData } = useSearchUsers(searchUserOptions);

    const onNameChange = useCallback(
        (newName: string) => {
            setQueryParams({
                ...queryParams,
                [QueryParamNames.Name]: newName || undefined,
            });
        },
        [queryParams, setQueryParams],
    );

    // Up and down arrow key navigation
    const [selection, setSelection] = useState(0);
    const navigate = useNavigate();
    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelection((prev) => Math.min(prev + 1, levelSearchData?.data.length ?? 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelection((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            if (selection > 0) {
                const level = levelSearchData?.data[selection - 1];
                if (level) {
                    void navigate('/level/' + level.ID);
                }
            } else {
                void onSearch();
            }
        }
    }

    const filterLabels: ReactNode[] = useMemo(() => {
        const filterLabels: ReactNode[] = [];

        const addRangeFilterLabel = (minKey: NumericFilterKeys, maxKey: NumericFilterKeys, label: string) => {
            const minValue = savedFilters[minKey] ?? undefined;
            const maxValue = savedFilters[maxKey] ?? undefined;

            if (minValue !== undefined || maxValue !== undefined) {
                filterLabels.push(
                    <RangeFilterLabel
                        min={minValue}
                        max={maxValue}
                        label={label}
                        onRemove={() => {
                            const updates = { [minKey]: undefined, [maxKey]: undefined };
                            setQueryParams({ ...queryParams, ...updates });
                            setSavedFilters((prev) => ({ ...prev, ...updates }));
                        }}
                    />,
                );
            }
        };

        const addStringFilterLabel = (filter: string, value: string, paramKey: keyof SavedFilters) => {
            if (!value) return;
            filterLabels.push(
                <FilterLabel
                    label={`${filter}: ${value}`}
                    onRemove={() => {
                        setQueryParams({ ...queryParams, [paramKey]: undefined });
                    }}
                />,
            );
        };

        addRangeFilterLabel(QueryParamNames.MinRating, QueryParamNames.MaxRating, 'tier');
        addRangeFilterLabel(QueryParamNames.MinEnjoyment, QueryParamNames.MaxEnjoyment, 'enjoyment');
        addRangeFilterLabel(QueryParamNames.MinSubmissionCount, QueryParamNames.MaxSubmissionCount, 'submissions');
        addRangeFilterLabel(QueryParamNames.MinEnjoymentCount, QueryParamNames.MaxEnjoymentCount, 'enjoyment ratings');

        if (savedFilters[QueryParamNames.Difficulty])
            addStringFilterLabel(
                'difficulty',
                difficulties[savedFilters[QueryParamNames.Difficulty]],
                QueryParamNames.Difficulty,
            );
        if (savedFilters[QueryParamNames.Length])
            addStringFilterLabel('length', lengths[savedFilters[QueryParamNames.Length]], QueryParamNames.Length);

        return filterLabels;
    }, [queryParams, savedFilters, setQueryParams, setSavedFilters]);

    return (
        <Page title='Search'>
            <Heading1 className='mb-2'>Levels</Heading1>
            <div className='flex gap-2 items-center transition-all'>
                <SearchInput
                    ref={searchInputRef}
                    onKeyDown={onKeyDown}
                    value={queryParams[QueryParamNames.Name] ?? ''}
                    onChange={(e) => onNameChange(e.target.value.trimStart().slice(0, 22))}
                    onClear={() => onNameChange('')}
                    onMenu={() => setShowFilters((prev) => !prev)}
                    autoFocus
                    placeholder='Search by name or ID'
                />
                <IconButton color='filled' onClick={() => void onSearch()}>
                    <i className='bx bx-search' />
                </IconButton>
            </div>
            <Filters reset={reset} show={showFilters} />
            <div className='flex justify-between'>
                <SortMenu />
                <button
                    className='text-theme-400 hover:text-theme-text transition-colors self-end'
                    onClick={() =>
                        app.set(
                            'levelViewType',
                            app.levelViewType === LevelViewType.GRID ? LevelViewType.LIST : LevelViewType.GRID,
                        )
                    }
                >
                    {app.levelViewType === LevelViewType.LIST ? (
                        <>
                            List <ListIcon className='inline-block -mt-1' />
                        </>
                    ) : (
                        <>
                            Grid <Grid className='inline-block -mt-1' />
                        </>
                    )}
                </button>
            </div>
            {levelSearchStatus === 'error' && (
                <Heading2 className='text-center'>An error occurred while searching</Heading2>
            )}
            {levelSearchStatus === 'pending' && (
                <div className='my-4'>
                    {Array.from({ length: 12 }, (_, i) => (
                        <LevelSkeleton key={i} />
                    ))}
                </div>
            )}
            {levelSearchStatus === 'success' && (
                <>
                    {filterLabels.length > 0 && (
                        <div className='py-2'>
                            <p>
                                <b className='text-lg'>Filters:</b>
                            </p>
                            <ul className='flex gap-2'>
                                {filterLabels.map((filter, i) => (
                                    <li key={i}>{filter}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {levelSearchData.data && app.levelViewType === LevelViewType.LIST ? (
                        <ListLevelPresenter levels={levelSearchData.data} selectedLevel={selection} />
                    ) : (
                        <GridLevelPresenter levels={levelSearchData.data} selectedLevel={selection} />
                    )}
                    <div className='my-4'>
                        <PageButtons limit={16} total={levelSearchData.total} page={page} onPageChange={setPage} />
                        <p className='text-center'>
                            <b>{levelSearchData.total}</b> level{pluralS(levelSearchData.total)} found
                        </p>
                    </div>
                </>
            )}
            <section>
                <Heading1 className='mb-2'>Users</Heading1>
                {userSearchStatus === 'pending' && <LoadingSpinner />}
                {userSearchStatus === 'success' && (
                    <>
                        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-4'>
                            {userSearchData.data.map((user) => (
                                <UserCard key={user.ID} user={user} />
                            ))}
                        </ul>
                        <PageButtons
                            limit={userSearchData.limit}
                            total={userSearchData.total}
                            page={userSearchData.page}
                            onPageChange={setUserPage}
                        />
                        <p className='text-center'>
                            <b>{userSearchData.total}</b> user{pluralS(userSearchData.total)}
                        </p>
                    </>
                )}
            </section>
        </Page>
    );
}
