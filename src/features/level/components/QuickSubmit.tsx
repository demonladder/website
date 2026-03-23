import { useState } from 'react';
import type { Level } from '../../../api/types/Level';
import { useSubmission } from '../../../components/modals/useSubmission';
import { NumberInput } from '../../../components/shared/input/Input';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import useSession from '../../../hooks/useSession';
import type { SubmissionStatus } from '../../profile/api/getUserPendingSubmissions';
import { clamp } from '../../../utils/clamp';
import Select from '../../../components/input/select/Select';
import { Link } from 'react-router';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import type { GetSingleSubmissionResponse } from '../../../api/submissions/GetSingleSubmission';

const statusOptions: Record<SubmissionStatus, string> = {
    beaten: 'Completed',
    beating: 'In progress',
    dropped: 'Dropped',
    hold: 'On hold',
    ptb: 'Plan to beat',
};

interface Props {
    level: Level;
}

export function QuickSubmit({ level }: Props) {
    const session = useSession();

    const query = useSubmission(level.ID, session.user?.ID, {
        enabled: session.user !== undefined,
    });

    if (!session.user) return;

    if (query.isPending) {
        return (
            <div className='round:rounded-lg bg-theme-700 border border-theme-outline p-2 my-2'>
                <LoadingSpinner />
            </div>
        );
    }

    return <QuickSubmitPresenter levelId={level.ID} submission={query.data} key={query.data?.ID} />;
}

interface QuickSubmitPresenterProps {
    levelId: number;
    submission?: GetSingleSubmissionResponse;
}

function QuickSubmitPresenter({ levelId, submission }: QuickSubmitPresenterProps) {
    const [statusOptionsKey, setStatusOptionsKey] = useState<SubmissionStatus>(submission?.status ?? 'ptb');
    const [tier, setTier] = useState(submission?.Rating ?? undefined);
    const [enjoyment, setEnjoyment] = useState(submission?.Enjoyment ?? undefined);
    const [progress, setProgress] = useState(submission?.Progress ?? 0);

    const handleProgressChange = (value: number) => {
        const p = Math.min(Math.max(value, 0), 100);
        setProgress(p);
        if (p === 100) {
            setStatusOptionsKey('beaten');
        } else if (p === 0) {
            setStatusOptionsKey('ptb');
            setTier(undefined);
            setEnjoyment(undefined);
        } else if (statusOptionsKey === 'beaten') {
            setStatusOptionsKey('beating');
        }
    };

    const handleStatusChange = (status: SubmissionStatus) => {
        setStatusOptionsKey(status);
        if (status === 'beaten') {
            setProgress(100);
        } else if (status === 'ptb') {
            setTier(undefined);
            setEnjoyment(undefined);
            setProgress(0);
        } else {
            setProgress(clamp(progress, 1, 99));
        }
    };

    return (
        <div className='round:rounded-lg bg-theme-700 border border-theme-outline p-2 my-2 flex justify-between flex-wrap'>
            <div className='flex flex-wrap gap-3 items-center'>
                <Select
                    id='submitStatus'
                    options={statusOptions}
                    key={statusOptionsKey}
                    onOption={(o) => handleStatusChange(o as SubmissionStatus)}
                    label={
                        <>
                            Status: <b className='ms-1'>{statusOptions[statusOptionsKey]}</b>
                        </>
                    }
                />
                {statusOptionsKey !== 'ptb' && (
                    <>
                        <div className='flex gap-2'>
                            <span>Tier:</span>
                            <div className='w-11'>
                                <NumberInput
                                    value={tier}
                                    onChange={(e) => setTier(parseInt(e.target.value))}
                                    disableSpinner={true}
                                    centered={true}
                                />
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <span>Enjoyment:</span>
                            <div className='w-11'>
                                <NumberInput
                                    value={enjoyment}
                                    onChange={(e) => setEnjoyment(parseInt(e.target.value))}
                                    disableSpinner={true}
                                    centered={true}
                                />
                            </div>
                        </div>
                        <div className='flex'>
                            <span className='me-2'>Progress:</span>
                            <div className='w-11'>
                                <NumberInput
                                    value={progress}
                                    onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                                    disableSpinner={true}
                                    centered={true}
                                />
                            </div>
                            <span className='ms-1'>%</span>
                        </div>
                    </>
                )}
            </div>
            <div className='ms-auto'>
                <Link to={`/submit/${levelId}`} className='me-2 text-sm link'>
                    advanced
                </Link>
                <PrimaryButton>{submission ? 'Save' : 'Submit'}</PrimaryButton>
            </div>
        </div>
    );
}
