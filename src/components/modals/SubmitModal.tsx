import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../layout/Modal';
import Select from '../shared/input/Select';
import { sendSubmission } from '../../api/submissions/sendSubmission';
import { NumberInput, URLInput } from '../shared/input/Input';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import renderToastError from '../../utils/renderToastError';
import { validateIntChange, validateIntInputChange } from '../../utils/validators/validateIntChange';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import WarningBox from '../message/WarningBox';
import { validateLink } from '../../utils/validators/validateLink';
import CheckBox from '../input/CheckBox';
import useUserSearch from '../../hooks/useUserSearch';
import FormInputLabel from '../form/FormInputLabel';
import FormInputDescription from '../form/FormInputDescription';
import useSession from '../../hooks/useSession';
import DeleteSubmission from '../../api/submissions/DeleteSubmission';
import { Difficulties, LevelLengths } from '../../features/level/types/LevelMeta';
import { useSubmission } from './useSubmission';
import FormGroup from '../form/FormGroup';
import { Device } from '../../api/core/enums/device.enum';
import { useApp } from '../../context/app/useApp';
import Checkbox from '../input/CheckBox';
import type { SubmissionStatus } from '../../features/profile/api/getUserPendingSubmissions';
import { clamp } from '../../utils/clamp';

interface Props {
    level: {
        ID: number;
        Rating: number | null;
        Meta: {
            Difficulty: Difficulties;
            Length: LevelLengths;
            IsTwoPlayer: boolean;
        };
    };
    userID?: number;
    onClose: () => void;
}

const enjoymentOptions = {
    '-1': '-',
    '0': '0 Abysmal',
    '1': '1 Appalling',
    '2': '2 Horrible',
    '3': '3 Bad',
    '4': '4 Subpar',
    '5': '5 Average',
    '6': '6 Fine',
    '7': '7 Good',
    '8': '8 Great',
    '9': '9 Amazing',
    '10': '10 Masterpiece',
};
type EnjoymentOptions = keyof typeof enjoymentOptions;

const deviceOptions: Record<Device, string> = {
    pc: 'PC',
    mobile: 'Mobile',
};

const statusOptions: Record<SubmissionStatus, string> = {
    beaten: 'Completed',
    beating: 'In progress',
    dropped: 'Dropped',
    hold: 'On hold',
    ptb: 'Plan to beat',
};

const MAX_TIER = parseInt(import.meta.env.VITE_MAX_TIER);
const MINIMUM_REFRESH_RATE = parseInt(import.meta.env.VITE_MINIMUM_REFRESH_RATE);

export default function SubmitModal({ onClose, level, userID }: Props) {
    const app = useApp();
    const [tier, setTier] = useState<string>('');
    const [enjoymentKey, setEnjoymentKey] = useState<EnjoymentOptions>('-1');
    const [deviceKey, setDeviceKey] = useState(app.defaultDevice ?? Device.PC);
    const [refreshRate, setRefreshRate] = useState((app.defaultRefreshRate ?? 60).toString());
    const [proof, setProof] = useState('');
    const [isProofPrivate, setIsProofPrivate] = useState(false);
    const [progress, setProgress] = useState(100);
    const [attempts, setAttempts] = useState<number>();
    const [wasSolo, setWasSolo] = useState(true);
    const [randomAttempts] = useState(
        ((x: number | null) => {
            if (!x) x = Math.random() + 4.5;
            return 15 * x ** 2 + 200 + (Math.random() * 2 - 1) * x ** 0.5 * 100;
        })(level.Rating),
    );
    const [statusOptionsKey, setStatusOptionsKey] = useState<SubmissionStatus>('beaten');

    const session = useSession();

    const { data: userSubmission, refetch: removeSubmissionData } = useSubmission(level.ID, session.user!.ID, {
        enabled: session.user !== undefined,
    });

    const secondPlayerSearch = useUserSearch({ ID: 'secondPlayerSubmit', maxUsersOnList: 2 });

    useEffect(() => {
        if (userSubmission === undefined) return;

        if (userSubmission.Rating !== null) setTier(userSubmission.Rating.toString());
        if (userSubmission.Enjoyment !== null) setEnjoymentKey(userSubmission.Enjoyment.toString() as EnjoymentOptions);
        setRefreshRate(userSubmission.RefreshRate.toString());
        setDeviceKey(userSubmission.Device);
        if (userSubmission.Proof !== null) setProof(userSubmission.Proof.toString());
        setProgress(userSubmission.Progress);
        if (userSubmission.Attempts !== null) setAttempts(userSubmission.Attempts);
        setWasSolo(userSubmission.IsSolo);
        if (userSubmission.SecondaryUser) secondPlayerSearch.setQuery(userSubmission.SecondaryUser.Name);
    }, [userSubmission, secondPlayerSearch]);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (userSubmission === undefined) return toast.error('Could not delete: no submission found!');
            return await toast.promise(DeleteSubmission(userSubmission?.ID), {
                pending: 'Deleting...',
                success: 'Submission deleted',
                error: renderToastError,
            });
        },
        onSuccess: () => {
            void removeSubmissionData();
            void queryClient.invalidateQueries({ queryKey: ['level', level.ID] });
            if (session.user?.ID !== undefined)
                void queryClient.invalidateQueries({ queryKey: ['user', session.user.ID] });
            onClose();
        },
    });

    const submitMutation = useMutation({
        mutationFn: sendSubmission,
    });

    function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rating = validateIntChange(tier);
        const enjoyment = enjoymentKey === '-1' ? null : parseInt(enjoymentKey);

        if (rating !== null) {
            if (rating < 1 || rating > MAX_TIER) {
                return toast.error(`Rating must be between 1 and ${MAX_TIER}!`);
            }

            if (rating >= 25 && !proof) {
                return toast.error('Proof is required if you want to rate a level 25 or higher!');
            }
        }

        if (attempts && attempts <= 0) {
            return toast.error('Attempt count must be a whole number greater than 0!');
        }

        const loadingHandle = toast.loading('Submitting...');
        submitMutation.mutate(
            {
                levelID: level.ID,
                rating: rating,
                enjoyment: enjoyment,
                refreshRate: parseInt(refreshRate),
                device: deviceKey,
                proof: proof.length > 0 ? proof : undefined,
                isProofPrivate,
                progress,
                status: statusOptionsKey,
                attempts,
                isSolo: wasSolo,
                secondPlayerID: secondPlayerSearch.activeUser?.ID,
            },
            {
                onSuccess: (data) => {
                    if (data.wasAuto) {
                        void queryClient.invalidateQueries({ queryKey: ['level', level.ID] });
                        void queryClient.invalidateQueries({ queryKey: ['submission', level.ID, userID] });
                        if (userID !== undefined) void queryClient.invalidateQueries({ queryKey: ['user', userID] });
                    } else {
                        void removeSubmissionData();
                    }
                    toast.success(data.wasAuto ? 'Submission accepted' : 'Submission queued');
                    onClose();
                },
                onError: (err: unknown) =>
                    toast.error(
                        err instanceof Error ? renderToastError.render({ data: err }) : 'An unknown error occurred!',
                    ),
                onSettled: () => toast.dismiss(loadingHandle),
            },
        );
    }

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        const newVal = validateIntChange(e.target.value);
        setRefreshRate(newVal?.toString() ?? (app.defaultRefreshRate ?? 60).toString());
    }

    function handleProgressChange(value: number) {
        const p = Math.min(Math.max(value, 0), 100);
        setProgress(p);
        if (p === 100) {
            setStatusOptionsKey('beaten');
        } else if (p === 0) {
            setStatusOptionsKey('ptb');
            setTier('');
            setEnjoymentKey('-1');
            setAttempts(undefined);
        } else if (statusOptionsKey === 'beaten') {
            setStatusOptionsKey('beating');
        }
    }

    function handleStatusChange(status: SubmissionStatus) {
        setStatusOptionsKey(status);
        if (status === 'beaten') {
            setProgress(100);
        } else if (status === 'ptb') {
            setTier('');
            setEnjoymentKey('-1');
            setProgress(0);
            setAttempts(undefined);
        } else {
            setProgress(clamp(progress, 1, 99));
        }
    }

    const requiresProof = useMemo(() => {
        if (statusOptionsKey === 'ptb') return false;
        if (level.Meta.Difficulty === Difficulties.Extreme) return true;
        if (parseInt(tier) >= 21) return true;
        return false;
    }, [statusOptionsKey, level.Meta.Difficulty, tier]);

    return (
        <Modal title='Submit rating' show={true} onClose={onClose}>
            <p className='my-3'>
                Make sure read and understood our{' '}
                <a href='/about#guidelines' className='text-blue-500' target='_blank'>
                    rating guidelines
                </a>
            </p>
            <form onSubmit={(e) => submitForm(e)} autoCorrect='off' autoCapitalize='off' spellCheck='false'>
                {level.Meta.Length === LevelLengths.PLATFORMER && (
                    <WarningBox>
                        Platformer submissions are currently restricted; it's not possible to vote for tiers yet!
                    </WarningBox>
                )}
                <FormGroup>
                    <FormInputLabel htmlFor='submitRating'>Tier</FormInputLabel>
                    <NumberInput
                        id='submitRating'
                        value={tier}
                        onChange={(e) => validateIntInputChange(e, setTier)}
                        inputMode='numeric'
                        min={1}
                        max={MAX_TIER}
                        autoFocus
                        disabled={level.Meta.Length === LevelLengths.PLATFORMER}
                    />
                    <p className='text-sm text-gray-400'>Must be 1-{MAX_TIER}</p>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel htmlFor='submitEnjoyment'>Enjoyment</FormInputLabel>
                    <Select
                        id='submitEnjoyment'
                        options={enjoymentOptions}
                        activeKey={enjoymentKey}
                        onChange={setEnjoymentKey}
                        zIndex={1030}
                    />
                </FormGroup>
                <FormGroup>
                    <FormInputLabel htmlFor='submitRefreshRate'>FPS</FormInputLabel>
                    <NumberInput
                        id='submitRefreshRate'
                        value={refreshRate}
                        onChange={(e) => validateIntInputChange(e, setRefreshRate)}
                        onBlur={onBlur}
                        invalid={parseInt(refreshRate) < MINIMUM_REFRESH_RATE}
                    />
                    <p className='text-sm text-gray-400'>At least {MINIMUM_REFRESH_RATE}fps</p>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel htmlFor='submitDevice'>Device</FormInputLabel>
                    <Select id='submitDevice' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                </FormGroup>
                <FormGroup>
                    <FormInputLabel htmlFor='submitProof'>
                        Proof{' '}
                        <a href='/about#proof' target='_blank'>
                            <i className='bx bx-info-circle' />
                        </a>
                    </FormInputLabel>
                    {level.Meta.Difficulty !== Difficulties.Extreme && Math.round(level.Rating ?? 16) < 16 && (
                        <p className='text-sm text-yellow-500'>
                            Please be aware that proof is not strictly required for easier levels. By not adding proof
                            you can bypass the queue and skip the waiting time to get this submission added.
                        </p>
                    )}
                    <URLInput
                        id='submitProof'
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        invalid={!validateLink(proof) && (requiresProof || proof !== '')}
                        required={requiresProof}
                        spellCheck={false}
                    />
                    <label className='flex items-center gap-1'>
                        <Checkbox checked={isProofPrivate} onChange={(e) => setIsProofPrivate(e.target.checked)} />
                        Private
                    </label>
                    <p className='text-sm text-gray-400'>
                        Proof is required for extreme demons. Clicks must be included if the level is tier 31 or higher.
                    </p>
                </FormGroup>
                {level.Meta.Length !== LevelLengths.PLATFORMER && (
                    <FormGroup>
                        <FormInputLabel>Percent</FormInputLabel>
                        <NumberInput
                            value={progress}
                            onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                            min={1}
                            max={100}
                            inputMode='numeric'
                            placeholder='100'
                            required
                        />
                        <FormInputDescription>
                            Optional, defaults to 100. Will not affect ratings if less than 100.
                        </FormInputDescription>
                    </FormGroup>
                )}
                <FormGroup>
                    <FormInputLabel htmlFor='submitStatus'>Status</FormInputLabel>
                    <Select
                        id='submitStatus'
                        options={statusOptions}
                        activeKey={statusOptionsKey}
                        onChange={handleStatusChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Attempts</FormInputLabel>
                    <NumberInput
                        value={attempts}
                        onChange={(e) => setAttempts(parseInt(e.target.value))}
                        min={1}
                        inputMode='numeric'
                        placeholder={randomAttempts.toFixed()}
                    />
                    <FormInputDescription>
                        Optional. How many attempts it took you to beat this level.
                    </FormInputDescription>
                </FormGroup>
                {/* <FormGroup>
                    <FormInputLabel>Completion date</FormInputLabel>
                    <div className='flex gap-2'>
                        <input type='date' className='border-b-2 bg-theme-950/70 grow' />
                        <input type='time' className='border-b-2 bg-theme-950/70' />
                    </div>
                </FormGroup> */}
                {level.Meta.IsTwoPlayer && (
                    <FormGroup>
                        <label className='flex items-center gap-2 mb-2'>
                            <CheckBox checked={wasSolo} onChange={(e) => setWasSolo(e.target.checked)} />
                            Solo completion
                        </label>
                        {!wasSolo && (
                            <div>
                                <p>The second player:</p>
                                {secondPlayerSearch.SearchBox}
                                <p className='text-sm text-gray-400'>
                                    If the person you beat this level with doesn't have an account, leave this blank
                                </p>
                            </div>
                        )}
                    </FormGroup>
                )}
                <FormGroup className='flex justify-between mt-8'>
                    <button
                        type='button'
                        className={
                            'text-red-400 underline-t disabled:text-gray-400 ' +
                            (userSubmission ? '' : 'opacity-0 pointer-events-none')
                        }
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.status === 'pending'}
                    >
                        delete
                    </button>
                    <div>
                        <SecondaryButton type='button' onClick={onClose}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton type='submit'>Submit</PrimaryButton>
                    </div>
                </FormGroup>
            </form>
        </Modal>
    );
}
