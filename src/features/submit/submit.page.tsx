import { Link, useLoaderData, useNavigate } from 'react-router';
import { Heading2 } from '../../components/headings';
import useLevelSearch from '../../hooks/useLevelSearch';
import { routes } from '../../routes/route-definitions';
import type { FullLevel } from '../../api/types/compounds/FullLevel';
import WarningBox from '../../components/message/WarningBox';
import { LevelLengths } from '../level/types/LevelMeta';
import FormInputLabel from '../../components/form/FormInputLabel';
import { NumberInput, URLInput } from '../../components/shared/input/Input';
import Select from '../../components/shared/input/Select';
import Checkbox from '../../components/input/CheckBox';
import FormInputDescription from '../../components/form/FormInputDescription';
import { PrimaryButton } from '../../components/ui/buttons/PrimaryButton';
import { Device } from '../../api/core/enums/device.enum';
import { useApp } from '../../context/app/useApp';
import { useEffect, useMemo, useState } from 'react';
import { validateIntChange, validateIntInputChange } from '../../utils/validators/validateIntChange';
import { validateLink } from '../../utils/validators/validateLink';
import SegmentedButtonGroup from '../../components/input/buttons/segmented/SegmentedButtonGroup';
import ListItem from '../../components/shared/ListItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendSubmission } from '../../api/submissions/sendSubmission';
import { toast } from 'react-toastify';
import renderToastError from '../../utils/renderToastError';
import useSession from '../../hooks/useSession';
import useUserSearch from '../../hooks/useUserSearch';
import { useSubmission } from '../../components/modals/useSubmission';
import FloatingLoadingSpinner from '../../components/ui/FloatingLoadingSpinner';
import type { SubmissionStatus } from '../profile/api/getUserPendingSubmissions';

const MAX_TIER = parseInt(import.meta.env.VITE_MAX_TIER);
const MINIMUM_REFRESH_RATE = parseInt(import.meta.env.VITE_MINIMUM_REFRESH_RATE);

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
    hold: 'On hold',
    dropped: 'Dropped',
    ptb: 'Plan to beat',
};

export default function SubmitPage() {
    const level = useLoaderData<FullLevel | null>();
    const navigate = useNavigate();
    const { SearchBox: LevelSearchBox } = useLevelSearch('submitLevelSearchBox', {
        onLevel(level) {
            if (level) void navigate(routes.submit.level.href(level.ID));
        },
        defaultLevel: level?.ID ?? undefined,
    });

    const app = useApp();
    const [tier, setTier] = useState<string>('');
    const [enjoymentKey, setEnjoymentKey] = useState<EnjoymentOptions>('-1');
    const [deviceKey, setDeviceKey] = useState(app.defaultDevice ?? Device.PC);
    const [statusKey, setStatusKey] = useState<keyof typeof statusOptions>('beaten');
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
        })(level?.Rating ?? 1),
    );
    const queryClient = useQueryClient();
    const session = useSession();
    const userID = session.user?.ID;
    const secondPlayerSearch = useUserSearch({ ID: 'secondPlayerSubmit', maxUsersOnList: 2 });

    const { data: existingSubmission, status } = useSubmission(level?.ID ?? 0, userID, {});

    useEffect(() => {
        if (existingSubmission) {
            setTier(existingSubmission.Rating?.toString() ?? '');
            setEnjoymentKey(
                existingSubmission.Enjoyment !== null && existingSubmission.Enjoyment !== undefined
                    ? (existingSubmission.Enjoyment.toString() as EnjoymentOptions)
                    : '-1',
            );
            setRefreshRate(existingSubmission.RefreshRate.toString());
            setDeviceKey(existingSubmission.Device);
            setProof(existingSubmission.Proof ?? '');
            setIsProofPrivate(existingSubmission.IsProofPrivate);
            setProgress(existingSubmission.Progress);
            setAttempts(existingSubmission.Attempts ?? undefined);
            setWasSolo(existingSubmission.IsSolo);
        }
    }, [existingSubmission]);

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        const newVal = validateIntChange(e.target.value);
        setRefreshRate(newVal?.toString() ?? (app.defaultRefreshRate ?? 60).toString());
    }

    function FPSChange(e: React.ChangeEvent<HTMLInputElement>) {
        validateIntInputChange(e, setRefreshRate);
    }

    function ratingChange(e: React.ChangeEvent<HTMLInputElement>) {
        validateIntInputChange(e, setTier);
    }

    const requiresProof = useMemo(() => {
        if (statusKey === 'ptb') return false;
        if (Math.round(level?.Rating ?? level?.DefaultRating ?? 1) >= 25) return true;
        if (parseInt(tier) >= 25) return true;
        return false;
    }, [level?.DefaultRating, level?.Rating, statusKey, tier]);

    function handleStatusChange(status: SubmissionStatus) {
        setStatusKey(status);
        if (status === 'beaten') {
            setProgress(100);
        } else if (status === 'ptb') {
            setTier('');
            setEnjoymentKey('-1');
            setProgress(0);
            setAttempts(undefined);
        } else {
            setProgress(Math.min(Math.max(progress, 1), 99));
        }
    }

    function handleProgressChange(value: number) {
        const p = Math.min(Math.max(value, 0), 100);
        setProgress(p);
        if (p === 100) {
            setStatusKey('beaten');
        } else if (p === 0) {
            setStatusKey('ptb');
            setTier('');
            setEnjoymentKey('-1');
            setAttempts(undefined);
        } else if (statusKey === 'ptb' || statusKey === 'beaten') {
            setStatusKey('beating');
        }
    }

    const submitMutation = useMutation({
        mutationFn: sendSubmission,
    });

    function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!level) return toast.error('No level selected!');

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
            return toast.error('Attempt count must be a number greater than 0!');
        }

        const loadingHandle = toast.loading('Submitting...');
        submitMutation.mutate(
            {
                levelID: level.ID,
                rating: rating,
                enjoyment: enjoyment,
                refreshRate: parseInt(refreshRate),
                device: deviceKey,
                proof: proof || null,
                isProofPrivate,
                progress,
                status: statusKey,
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
                    }
                    toast.success(data.wasAuto ? 'Submission accepted' : 'Submission queued');
                },
                onError: (err: unknown) =>
                    toast.error(
                        err instanceof Error ? renderToastError.render({ data: err }) : 'An unknown error occurred!',
                    ),
                onSettled: () => toast.dismiss(loadingHandle),
            },
        );
    }

    return (
        <div className='grow container mx-auto p-4'>
            <div className='max-md:flex flex-col grid grid-cols-2 bg-theme-800 border border-theme-500/20 rounded-xl p-4 gap-8'>
                <div>
                    <Heading2>Submit</Heading2>
                    {LevelSearchBox}
                    {level && (
                        <>
                            <form
                                onSubmit={submitForm}
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck='false'
                                className='grid grid-cols-2 gap-4 relative mt-4'
                            >
                                <FloatingLoadingSpinner isLoading={status === 'pending'} />
                                {level.Meta.Length === LevelLengths.PLATFORMER && (
                                    <WarningBox>
                                        Platformer submissions are currently restricted; it's not possible to vote for
                                        tiers yet!
                                    </WarningBox>
                                )}
                                <div>
                                    <FormInputLabel htmlFor='submitRating'>Tier</FormInputLabel>
                                    <NumberInput
                                        id='submitRating'
                                        value={tier}
                                        onChange={ratingChange}
                                        inputMode='numeric'
                                        min={1}
                                        max={MAX_TIER}
                                        autoFocus
                                        disabled={level.Meta.Length === LevelLengths.PLATFORMER}
                                    />
                                </div>
                                <div>
                                    <FormInputLabel>Enjoyment</FormInputLabel>
                                    <Select
                                        id='submitEnjoyment'
                                        options={enjoymentOptions}
                                        activeKey={enjoymentKey}
                                        onChange={setEnjoymentKey}
                                        zIndex={1030}
                                    />
                                </div>
                                <div>
                                    <FormInputLabel htmlFor='submitRefreshRate'>FPS</FormInputLabel>
                                    <NumberInput
                                        id='submitRefreshRate'
                                        value={refreshRate}
                                        onChange={FPSChange}
                                        onBlur={onBlur}
                                        invalid={parseInt(refreshRate) < MINIMUM_REFRESH_RATE}
                                    />
                                    <p className='text-sm text-gray-400'>At least {MINIMUM_REFRESH_RATE}fps</p>
                                </div>
                                <div>
                                    <FormInputLabel htmlFor='submitDevice'>
                                        Device <span className='text-red-600'>*</span>
                                    </FormInputLabel>
                                    <SegmentedButtonGroup
                                        activeKey={deviceKey}
                                        onSetActive={setDeviceKey}
                                        options={deviceOptions}
                                    />
                                </div>
                                <div className='col-span-2'>
                                    <FormInputLabel htmlFor='submitProof'>
                                        Proof {requiresProof && <span className='text-red-600'>*</span>}{' '}
                                        <a href='/about#proof' target='_blank'>
                                            <i className='bx bx-info-circle' />
                                        </a>
                                    </FormInputLabel>
                                    <URLInput
                                        id='submitProof'
                                        value={proof}
                                        onChange={(e) => setProof(e.target.value)}
                                        invalid={!validateLink(proof) && (requiresProof || proof !== '')}
                                        required={requiresProof}
                                        spellCheck={false}
                                    />
                                    <label className='flex items-center gap-1'>
                                        <Checkbox
                                            checked={isProofPrivate}
                                            onChange={(e) => setIsProofPrivate(e.target.checked)}
                                        />
                                        Private
                                    </label>
                                </div>
                                {level.Meta.Length !== LevelLengths.PLATFORMER && (
                                    <div>
                                        <FormInputLabel>Percent</FormInputLabel>
                                        <NumberInput
                                            value={progress}
                                            onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                                            min={0}
                                            max={100}
                                            inputMode='numeric'
                                            placeholder='100'
                                        />
                                        <FormInputDescription>
                                            Optional, defaults to 100. Will not affect the level rating if set to less
                                            than 100.
                                        </FormInputDescription>
                                    </div>
                                )}
                                <div>
                                    <FormInputLabel>Attempts</FormInputLabel>
                                    <NumberInput
                                        value={attempts}
                                        onChange={(e) => setAttempts(parseInt(e.target.value))}
                                        min={1}
                                        inputMode='numeric'
                                        placeholder={randomAttempts.toFixed()}
                                    />
                                    <FormInputDescription>Optional.</FormInputDescription>
                                </div>
                                <div className='col-span-2 max-2xl:text-xs'>
                                    <FormInputLabel htmlFor='submitStatus'>Status</FormInputLabel>
                                    <SegmentedButtonGroup
                                        activeKey={statusKey}
                                        onSetActive={handleStatusChange}
                                        options={statusOptions}
                                    />
                                </div>
                                {level.Meta.IsTwoPlayer && (
                                    <div className='col-span-2'>
                                        <label className='flex items-center gap-2 mb-2'>
                                            <Checkbox
                                                checked={wasSolo}
                                                onChange={(e) => setWasSolo(e.target.checked)}
                                            />
                                            Solo completion
                                        </label>
                                        {!wasSolo && (
                                            <div>
                                                <p>The second player:</p>
                                                {secondPlayerSearch.SearchBox}
                                                <p className='text-sm text-gray-400'>
                                                    If the person you beat this level with doesn't have an account,
                                                    leave this blank
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <PrimaryButton className='col-span-2 mt-4' size='md' type='submit'>
                                    Submit
                                </PrimaryButton>
                            </form>
                        </>
                    )}
                </div>
                <div>
                    <Heading2>Rating guidelines</Heading2>
                    <section>
                        <p className='mb-2'>
                            Make sure you have read the{' '}
                            <Link to='/about#guidelines' className='text-blue-500'>
                                rating guidelines
                            </Link>{' '}
                            before submitting your rating. Here is a brief rundown:
                        </p>
                        <ol className='ps-2'>
                            <li className='mb-5'>
                                <p className='mb-1'>
                                    1) Your rating should be based on the difficulty of the whole level, which means you
                                    should not rate based on the difficulty of the hardest section.
                                </p>
                            </li>
                            <li className='mb-5'>
                                <p className='mb-1'>
                                    2) For levels that contains multiple paths or has bonus objectives, rate according
                                    to the easiest path that is not hidden.
                                </p>
                            </li>
                            <li className='mb-5'>
                                <p className='mb-1'>3) You should ignore the official difficulty in-game.</p>
                            </li>
                            <li className='mb-5'>
                                <p className='mb-1'>
                                    4) You do not need to follow others' opinion and rate as what others suggest.
                                </p>
                            </li>
                            <li className='mb-5'>
                                <p className='mb-1'>5) Assume bugs in a level are fixed while rating the demons.</p>
                            </li>
                            <li className='mb-5'>
                                <p className='mb-1'>6) Tier 25+ demon submissions require video proof.</p>
                                <ul>
                                    <ListItem>
                                        For levels below this tier, the proof will be set to private and will only be
                                        visible to you and staff.
                                    </ListItem>
                                </ul>
                            </li>
                            <li className='mb-5'>
                                <p className='mb-1'>7) Physics bypass above 240 is not allowed.</p>
                            </li>
                            <li className='mb-5'>
                                <p className='mb-1'>
                                    8) The level must be beat on the official version or on a verified LDM.
                                </p>
                            </li>
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    );
}
