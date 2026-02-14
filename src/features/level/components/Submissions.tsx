import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import PageButtons from '../../../components/shared/PageButtons';
import RefreshRateIcon from './RefreshRateIcon';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import { Submission as ISubmission, SubmissionSort, getLevelSubmissions } from '../api/getLevelSubmissions';
import useRoles from '../../../hooks/api/useRoles';
import TwoPlayerButtons from './TwoPlayerButtons';
import useContextMenu from '../../../context/menu/useContextMenu';
import { PermissionFlags } from '../../admin/roles/PermissionFlags';
import useDeleteSubmissionModal from '../../../hooks/modals/useDeleteSubmissionModal';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';
import { createEnumParam, useQueryParam, withDefault } from 'use-query-params';
import { Device } from '../../../api/core/enums/device.enum';
import { Heading2 } from '../../../components/headings';
import Select from '../../../components/input/select/Select';
import SegmentedButtonGroup from '../../../components/input/buttons/segmented/SegmentedButtonGroup';
import Tooltip from '../../../components/ui/Tooltip';
import { ArrowDownAZ, ArrowUpAZ } from '@boxicons/react';

const sorts: Record<SubmissionSort, string> = {
    [SubmissionSort.DATE_ADDED]: 'Date added',
    [SubmissionSort.RATING]: 'Rating',
    [SubmissionSort.ENJOYMENT]: 'Enjoyment',
    [SubmissionSort.REFRESH_RATE]: 'Refresh rate',
    [SubmissionSort.PROGRESS]: 'Progress',
    [SubmissionSort.ATTEMPTS]: 'Attempts',
    [SubmissionSort.USERNAME]: 'Username',
};

interface SubmissionProps {
    level: Level & { Meta: LevelMeta };
    submission: ISubmission;
}

const statusOptions = {
    all: 'All',
    completed: 'Victors',
    beating: 'Progress',
};
type StatusOptions = keyof typeof statusOptions;

function Submission({ level, submission }: SubmissionProps) {
    const { data: roles } = useRoles();
    const userRoles =
        roles && submission.User.roles.map((r) => roles.find((role) => role.ID === r)).filter((r) => r !== undefined);
    // const secondaryUserRoles = roles && submission.SecondaryUser?.roles.map((r) => roles.find(role => role.ID === r)).filter((r) => r !== undefined);

    // Find the highest non-null role color
    const iconRole =
        userRoles
            ?.sort((a, b) => (a?.Ordering ?? 0) - (b?.Ordering ?? 0))
            .filter((r) => r?.Color !== null)
            .at(0) ?? null;
    // const secondaryIconRole = secondaryUserRoles?.sort((a, b) => (a?.Ordering ?? 0) - (b?.Ordering ?? 0)).filter((r) => r?.Color !== null).at(0) ?? null;

    const enj = submission.Enjoyment == null ? '-1' : submission.Enjoyment;
    const enjText = submission.Enjoyment == null ? '-' : submission.Enjoyment;

    const linkDestination = `/profile/${submission.User.ID}`;

    const hasWidgets = submission.Proof !== null || submission.Device === Device.MOBILE || submission.Progress < 100;

    const title: string[] = [];
    title.push(submission.User.Name);
    title.push(`Sent at: ${new Date(submission.DateAdded).toLocaleString()}`);
    title.push(`${submission.RefreshRate}fps`);
    title.push(`Progress: ${submission.Progress}%`);
    if (submission.Attempts) title.push(`Attempts: ${submission.Attempts}`);
    if (submission.Device === Device.MOBILE) title.push('Completed on mobile');

    const MAX_NAME_LENGTH = 17;
    const username = submission.User.Name;
    const shortenedName = username.length > MAX_NAME_LENGTH ? username.slice(0, MAX_NAME_LENGTH) + '...' : username;
    const shortenedSecondaryName =
        submission.SecondaryUser && submission.SecondaryUser.Name.length > MAX_NAME_LENGTH
            ? submission.SecondaryUser.Name.slice(0, MAX_NAME_LENGTH) + '...'
            : submission.SecondaryUser?.Name;

    const openDeleteSubmissionModal = useDeleteSubmissionModal();
    const openContext = useContextMenu([
        { text: 'View user', to: linkDestination },
        {
            text: 'View proof',
            icon: <i className='bx bx-link-external' />,
            onClick: () => window.open(submission.Proof!, '_blank'),
            disabled: submission.Proof === null || submission.Proof === '',
        },
        { type: 'divider', permission: PermissionFlags.MANAGE_SUBMISSIONS },
        {
            text: 'Mod view',
            to: `/mod/editSubmission/${submission.ID}`,
            permission: PermissionFlags.MANAGE_SUBMISSIONS,
        },
        {
            text: 'Delete',
            icon: <i className='bx bx-trash' />,
            type: 'danger',
            onClick: () => openDeleteSubmissionModal(submission.User.ID, level.ID, submission.ID, submission.User.Name),
            permission: PermissionFlags.MANAGE_SUBMISSIONS,
        },
    ]);

    return (
        <div
            onContextMenu={openContext}
            title={title.join('\n')}
            className='text-lg min-h-13 flex select-none round:rounded-md border border-white/0 hover:border-white/100 transition-colors shadow'
        >
            <Link
                className={`flex items-center justify-center basis-14 p-2 round:rounded-s-md tier-${submission.Rating ? submission.Rating : '0'}`}
                to={linkDestination}
            >
                {submission.Rating ? (
                    submission.weight > 0 ? (
                        submission.Rating
                    ) : (
                        <Tooltip label={`Original rating (${submission.Rating}) has been weighted by 0`}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                style={{ fill: 'currentColor', transform: '', msFilter: '' }}
                            >
                                <path d='M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467L12.884 2.532zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z'></path>
                            </svg>
                        </Tooltip>
                    )
                ) : (
                    '-'
                )}
            </Link>
            <Link
                className={`flex items-center justify-center basis-14 p-2 text-center enj-${enj}`}
                to={linkDestination}
            >
                {enjText}
            </Link>
            <Link className='p-2 flex items-center flex-grow bg-theme-500 shrink overflow-hidden' to={linkDestination}>
                {submission.SecondaryUser ? (
                    <>
                        <p
                            className={iconRole ? 'font-bold' : ''}
                            style={
                                iconRole?.Color
                                    ? { color: `#${iconRole.Color.toString(16).padStart(6, '0')}` }
                                    : undefined
                            }
                        >
                            {shortenedName} {iconRole?.Icon}
                        </p>
                        {/* <p className={secondaryIconRole ? 'font-bold' : ''} style={secondaryIconRole?.Color ? { color: `#${secondaryIconRole.Color.toString(16).padStart(6, '0')}` } : undefined}>{shortenedSecondaryName} {secondaryIconRole?.Icon}</p> */}
                        <p className='text-sm text-white/70'>+ {shortenedSecondaryName}</p>
                    </>
                ) : (
                    <div className='flex items-center gap-1'>
                        {submission.User.avatar && (
                            <img
                                src={`https://cdn.gdladder.com/avatars/${submission.User.ID}/${submission.User.avatar}.png?size=32`}
                                className='rounded-full max-w-8 max-h-8 self-center inline-block'
                                alt='Profile'
                            />
                        )}
                        <p
                            className={iconRole ? 'font-bold' : ''}
                            style={
                                iconRole?.Color
                                    ? { color: `#${iconRole.Color.toString(16).padStart(6, '0')}` }
                                    : undefined
                            }
                        >
                            {shortenedName} {iconRole?.Icon}
                        </p>
                    </div>
                )}
            </Link>
            {hasWidgets && (
                <span className='flex gap-1 items-center bg-theme-500 pe-2'>
                    {submission.Device === Device.MOBILE && <i className='bx bx-mobile-alt' />}
                    {submission.Proof && (
                        <a
                            className='cursor-pointer flex items-center'
                            href={submission.Proof}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <i className='bx bx-link'></i>
                        </a>
                    )}
                    {submission.Progress < 100 && <span>{submission.Progress}%</span>}
                </span>
            )}
            <RefreshRateIcon refreshRate={submission.RefreshRate} />
        </div>
    );
}

interface SubmissionsProps {
    page: number;
    setPage: (page: number) => void;
    level: FullLevel;
    showTwoPlayerStats: boolean;
    setShowTwoPlayerStats: (show: boolean) => void;
}

export default function Submissions({
    page,
    setPage,
    level,
    showTwoPlayerStats,
    setShowTwoPlayerStats,
}: SubmissionsProps) {
    const [sorter, setSorter] = useQueryParam<SubmissionSort>(
        'sort',
        withDefault(createEnumParam(Object.values(SubmissionSort)), SubmissionSort.DATE_ADDED),
    );
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [statusOptionsKey, setStatusOptionsKey] = useState<StatusOptions>('all');

    const { data: submissions, status } = useQuery({
        queryKey: [
            'level',
            level.ID,
            'submissions',
            { page, status: statusOptionsKey, twoPlayer: showTwoPlayerStats, sort: sorter, sortDirection },
        ],
        queryFn: () =>
            getLevelSubmissions({
                twoPlayer: showTwoPlayerStats,
                levelID: level.ID,
                sort: sorter,
                sortDirection,
                progressFilter:
                    statusOptionsKey === 'completed'
                        ? 'victors'
                        : statusOptionsKey === 'beating'
                          ? 'incomplete'
                          : 'all',
                limit: 24,
                page,
            }),
    });

    if (status === 'error' || status === 'pending')
        return (
            <section className='mt-6'>
                <Heading2>Submissions</Heading2>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <SubmissionSkeleton key={i} />
                    ))}
                </div>
            </section>
        );

    return (
        <section className='mt-6'>
            <Heading2>Submissions</Heading2>
            <TwoPlayerButtons
                levelMeta={level.Meta}
                showTwoPlayerStats={showTwoPlayerStats}
                setShowTwoPlayerStats={setShowTwoPlayerStats}
            />
            <div className='flex flex-wrap gap-2 mb-2'>
                <Select label={`Sort by: ${sorts[sorter]}`} options={sorts} onOption={setSorter} />
                <button
                    className='px-3 bg-secondary-container text-on-secondary-container rounded-full'
                    onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                >
                    {sortDirection === 'asc' ? <ArrowUpAZ /> : <ArrowDownAZ />}
                </button>
                <SegmentedButtonGroup
                    options={statusOptions}
                    activeKey={statusOptionsKey}
                    onSetActive={setStatusOptionsKey}
                />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2'>
                {submissions.data.map((s) => (
                    <Submission level={level} submission={s} key={s.User.ID} />
                ))}
                {submissions.data.length === 0 ? <p className='mb-0'>No submissions available!</p> : null}
            </div>
            <PageButtons
                onPageChange={(page) => setPage(page)}
                page={page}
                limit={submissions.limit}
                total={submissions.total}
            />
        </section>
    );
}

function SubmissionSkeleton() {
    return <div className='min-h-[46px] round:rounded-md shimmer' />;
}
