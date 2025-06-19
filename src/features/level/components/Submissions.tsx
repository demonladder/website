import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import PageButtons from '../../../components/PageButtons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import RefreshRateIcon from './RefreshRateIcon';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import { Submission as ISubmission, getLevelSubmissions } from '../api/getLevelSubmissions';
import Select from '../../../components/Select';
import useRoles from '../../../hooks/api/useRoles';
import TwoPlayerButtons from './TwoPlayerButtons';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import { PermissionFlags } from '../../admin/roles/PermissionFlags';
import useDeleteSubmissionModal from '../../../hooks/modals/useDeleteSubmissionModal';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';
import pluralS from '../../../utils/pluralS';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { Device } from '../../../api/core/enums/device.enum';

interface SubmissionProps {
    level: Level & { Meta: LevelMeta };
    submission: ISubmission;
}

const progressFilterOptions = {
    victors: 'victors',
    all: 'all',
    incomplete: 'users with progress',
};

function Submission({ level, submission }: SubmissionProps) {
    const { data: roles } = useRoles();
    const userRoles = roles && submission.User.RoleIDs.split(',').map(Number).map((r) => roles.find(role => role.ID === r)).filter((r) => r !== undefined);
    const secondaryUserRoles = roles && submission.SecondaryUser?.RoleIDs.split(',').map(Number).map((r) => roles.find(role => role.ID === r)).filter((r) => r !== undefined);

    // Find the highest non-null role color
    const iconRole = userRoles?.sort((a, b) => (a?.Ordering ?? 0) - (b?.Ordering ?? 0)).filter((r) => r?.Color !== null).at(0) ?? null;
    const secondaryIconRole = secondaryUserRoles?.sort((a, b) => (a?.Ordering ?? 0) - (b?.Ordering ?? 0)).filter((r) => r?.Color !== null).at(0) ?? null;

    const enj = submission.Enjoyment == null ? '-1' : submission.Enjoyment;
    const enjText = submission.Enjoyment == null ? '-' : submission.Enjoyment;

    const linkDestination = `/profile/${submission.UserID}`;

    const hasWidgets = submission.Proof !== null || submission.Device === Device.MOBILE;

    const title: string[] = [];
    title.push(submission.User.Name);
    title.push(`Sent at: ${new Date(submission.DateAdded).toLocaleString()}`);
    title.push(`Last changed at: ${new Date(submission.DateChanged).toLocaleString()}`);
    title.push(`${submission.RefreshRate}fps`);
    title.push(`Progress: ${submission.Progress}%`);
    if (submission.Attempts) title.push(`Attempts: ${submission.Attempts}`);
    if (submission.Device === Device.MOBILE) title.push('Completed on mobile');

    const shortenedName = submission.User.Name.length > 20 ? submission.User.Name.slice(0, 20) + '...' : submission.User.Name;
    const shortenedSecondaryName = (submission.SecondaryUser && submission.SecondaryUser.Name.length > 20) ? submission.SecondaryUser.Name.slice(0, 20) + '...' : submission.SecondaryUser?.Name;

    const openDeleteSubmissionModal = useDeleteSubmissionModal();
    const navigate = useNavigate();
    const openContext = useContextMenu([
        { text: 'View Profile', onClick: () => navigate(linkDestination) },
        { text: <>View proof <i className='bx bx-link-external' /></>, onClick: () => window.open(submission.Proof!, '_blank'), disabled: submission.Proof === null || submission.Proof === '' },
        { text: 'Mod view', onClick: () => navigate(`/mod/editSubmission?levelID=${submission.LevelID}&userID=${submission.UserID}`), permission: PermissionFlags.MANAGE_SUBMISSIONS },
        { text: 'Delete', type: 'danger', onClick: () => openDeleteSubmissionModal(level, submission), permission: PermissionFlags.MANAGE_SUBMISSIONS },
    ]);

    return (
        <div onContextMenu={openContext} title={title.join('\n')} className='text-sm lg:text-lg flex select-none round:rounded-md border border-white/0 hover:border-white/100 transition-colors shadow'>
            <Link className={`flex items-center justify-center w-[40px] lg:w-1/6 p-2 round:rounded-s-md tier-${submission.Rating ? submission.Rating : '0'}`} to={linkDestination}>{submission.Rating || '-'}</Link>
            <Link className={`flex items-center justify-center w-[40px] lg:w-1/6 p-2 text-center enj-${enj}`} to={linkDestination}>{enjText}</Link>
            <Link className='p-2 flex-grow bg-theme-500' to={linkDestination}>
                {submission.SecondaryUser
                    ? <>
                        <p className={iconRole ? 'font-bold' : ''} style={iconRole?.Color ? { color: `#${iconRole.Color.toString(16).padStart(6, '0')}` } : undefined}>{shortenedName} {iconRole?.Icon}</p>
                        <p className={secondaryIconRole ? 'font-bold' : ''} style={secondaryIconRole?.Color ? { color: `#${secondaryIconRole.Color.toString(16).padStart(6, '0')}` } : undefined}>{shortenedSecondaryName} {secondaryIconRole?.Icon}</p>
                    </>
                    : <p className={iconRole ? 'font-bold' : ''} style={iconRole?.Color ? { color: `#${iconRole.Color.toString(16).padStart(6, '0')}` } : undefined}>{shortenedName} {iconRole?.Icon}</p>
                }
            </Link>
            {hasWidgets &&
                <span className='flex gap-1 items-center bg-theme-500 pe-2'>
                    {submission.Device === Device.MOBILE &&
                        <i className='bx bx-mobile-alt' />
                    }
                    {submission.Proof &&
                        <a className='cursor-pointer flex items-center' href={submission.Proof} target='_blank' rel='noopener noreferrer'>
                            <i className='bx bx-link'></i>
                        </a>
                    }
                </span>
            }
            <RefreshRateIcon refreshRate={submission.RefreshRate} />
        </div>
    );
}

interface SubmissionsProps {
    level: FullLevel;
    showTwoPlayerStats: boolean;
    setShowTwoPlayerStats: (show: boolean) => void;
}

export default function Submissions({ level, showTwoPlayerStats, setShowTwoPlayerStats }: SubmissionsProps) {
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));
    const [progressFilterKey, setProgressFilterKey] = useState<keyof typeof progressFilterOptions>('victors');

    const { data: submissions, status } = useQuery({
        queryKey: ['level', level.ID, 'submissions', { page, progressFilterKey, twoPlayer: showTwoPlayerStats }],
        queryFn: () => getLevelSubmissions({ twoPlayer: showTwoPlayerStats, levelID: level.ID, progressFilter: progressFilterKey, limit: 24, page }),
    });

    useEffect(() => {
        setPage(0);
    }, [showTwoPlayerStats, setPage]);

    if (status === 'error' || status === 'pending') return (
        <section className='mt-6'>
            <h2 className='text-3xl'>Submissions</h2>
            <LoadingSpinner />
        </section>
    );

    return (
        <section className='mt-6'>
            <h2 className='text-3xl'>{submissions.total} Submission{pluralS(submissions.total)}</h2>
            <TwoPlayerButtons levelMeta={level.Meta} showTwoPlayerStats={showTwoPlayerStats} setShowTwoPlayerStats={setShowTwoPlayerStats} />
            <div className='flex'>
                <p className='me-1'>Showing</p>
                <div className='max-w-xs grow'>
                    <Select options={progressFilterOptions} activeKey={progressFilterKey} onChange={setProgressFilterKey} id='submissionsProgressFilter' />
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
                {submissions.submissions.map((s) => <Submission level={level} submission={s} key={s.UserID} />)}
                {submissions.submissions.length === 0 ? <p className='mb-0'>This level does not have any submissions</p> : null}
            </div>
            <PageButtons onPageChange={(page) => setPage(page)} meta={{ total: submissions.total, limit: submissions.limit, page }} />
        </section>
    );
}
