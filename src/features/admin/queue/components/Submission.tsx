import { Link } from 'react-router';
import { QueueSubmission } from '../api/getPendingSubmissions';
import { useApproveClicked } from '../hooks/useApproveClicked';
import { levelLengthToString } from '../../../level/types/LevelMeta';
import useDenySubmissionModal from '../../../../hooks/modals/useDenySubmissionModal';
import { useMemo } from 'react';
import Heading4 from '../../../../components/headings/Heading4';
import { DemonLogoSizes } from '../../../../utils/difficultyToImgSrc';
import { difficultyToImgSrc } from '../../../../utils/difficultyToImgSrc';
import { toast } from 'react-toastify';
import { useLevelSubmissionSpread } from '../../../../hooks/api/level/submissions/useLevelSubmissionSpread';
import { ratingToWeight, weightedRatingAverage } from '../../../../utils/weightedAverage';
import { average } from '../../../../utils/average';
import standardDeviation from '../../../../utils/standardDeviation';
import TonalButton from '../../../../components/input/buttons/tonal/TonalButton';
import FilledButton from '../../../../components/input/buttons/filled/FilledButton';
import { secondsToHumanReadable } from '../../../../utils/secondsToHumanReadable';
import useSessionStorage from '../../../../hooks/useSessionStorage';
import { NumberParam, useQueryParam } from 'use-query-params';

interface Props {
    submission: QueueSubmission;
}

export default function Submission({ submission }: Props) {
    const showDenyModal = useDenySubmissionModal();
    const [isProofClicked, setIsProofClicked] = useSessionStorage(`queue.${submission.ID}.isProofClicked`, false);
    const [proofClickedAt, setProofClickedAt] = useSessionStorage(`queue.${submission.ID}.proofClickedAt`, 'undefined');

    const spread = useLevelSubmissionSpread(submission.LevelID);
    const ratingsWithSubmission = useMemo(() => {
        const data = submission.IsSolo ? spread.data?.rating : spread.data?.twoPlayerRating;
        const ratings = data?.map((rating) => Array.from({ length: rating.Count }, () => rating.Rating)).flat() ?? [];
        if (submission.Rating !== null) ratings.push(submission.Rating);

        return ratings;
    }, [spread.data?.rating, spread.data?.twoPlayerRating, submission.IsSolo, submission.Rating]);

    const newSTDDev = useMemo(() => {
        if (submission.Rating === null) return 0;

        return standardDeviation(ratingsWithSubmission);
    }, [ratingsWithSubmission, submission.Rating]);

    const newLevelRating = useMemo(() => {
        if (ratingsWithSubmission.length === 0) return null;

        if (ratingsWithSubmission.length < 5) average(ratingsWithSubmission);
        return weightedRatingAverage(ratingsWithSubmission);
    }, [ratingsWithSubmission]);

    const weight = useMemo(() => {
        if (submission.Rating === null) return;
        if (newSTDDev === undefined) return 1;

        return ratingToWeight(submission.Rating, average(ratingsWithSubmission)!, newSTDDev);
    }, [newSTDDev, ratingsWithSubmission, submission.Rating]);

    const levelRating = submission.IsSolo ? submission.Level.Rating : submission.Level.TwoPlayerRating;

    const difference = useMemo(() => {
        if (submission.Rating === null || levelRating === null) return;
        return Math.abs(submission.Rating - levelRating);
    }, [submission.Rating, levelRating]);

    const standardDeviations = useMemo(() => {
        if (difference === undefined) return;
        if (submission.Level.RatingCount < 5) return 0;

        return difference / newSTDDev;
    }, [difference, newSTDDev, submission.Level.RatingCount]);

    const outlierText = useMemo(() => {
        if (standardDeviations === undefined) return;
        if (difference !== undefined && difference <= 2) return;
        if (standardDeviations <= 1.5) return;
        if (standardDeviations <= 2) return <><i className='bx bxs-error'></i> Semi-outlier detected!</>;
        if (standardDeviations <= 3) return <><i className='bx bxs-error'></i> Outlier detected!</>;
        if (standardDeviations <= 5) return <><i className='bx bxs-error'></i> Outlier detected! (rating won't count)</>;
        return <><i className='bx bxs-error'></i> Possible troll detected!</>;
    }, [difference, standardDeviations]);

    function onProofClick() {
        if (!submission.Proof) return toast.error('No proof URL provided');

        setIsProofClicked(true);
        setProofClickedAt(new Date().toISOString());
        window.open(submission.Proof, '_blank', 'noopener,noreferrer');
    }

    function getProofReviewTime() {
        if (!proofClickedAt) return null;
        return new Date().getTime() - new Date(proofClickedAt).getTime();
    }

    const [queueLevelIDFilter, setQueueLevelIDFilter] = useQueryParam('levelID', NumberParam);
    function onFilter(levelID: number) {
        if (queueLevelIDFilter === levelID) setQueueLevelIDFilter(undefined);
        else setQueueLevelIDFilter(levelID);
    }

    const approveSubmission = useApproveClicked();

    const secondsAgo = Math.floor((Date.now() - new Date(submission.DateChanged.replace(' +00:00', 'Z').replace(' ', 'T')).getTime()) / 1000);

    return (
        <li className={`round:rounded-2xl bg-linear-to-br tier-${submission.Rating ?? 0} from-tier-${submission.Rating ?? 0} to-tier-${levelRating?.toFixed() ?? 0} p-3 my-2 text-lg`}>
            <Link className='flex items-center gap-2 mb-2 cursor-pointer' to={`/level/${submission.LevelID}`}>
                <img src={difficultyToImgSrc(submission.Level.Meta.Difficulty, DemonLogoSizes.SMALL)} />
                <div>
                    <p className='font-bold text-3xl'>{submission.Level.Meta.Name}</p>
                    <p>by {submission.Level.Meta.Publisher?.name ?? '(-)'}</p>
                </div>
            </Link>
            <div className='mb-3'>
                <p><i className='bx bxs-user' /> Submitted by <a href={`/profile/${submission.UserID}`} className='font-bold group' target='_blank' rel='noopener noreferrer'>{submission.User.Name} <i className='bx bx-link-external' /></a></p>
                <p><i className='bx bxs-time-five' /> Submitted at <b>{new Date(submission.DateChanged.replace(' +00:00', 'Z').replace(' ', 'T')).toLocaleString()}</b> ({secondsToHumanReadable(secondsAgo)} ago)</p>
            </div>
            <div className='grid grid-cols-3 gap-4 max-md:grid-cols-1'>
                <div>
                    <Heading4 className='mb-2'>Submission info</Heading4>
                    <div className='mb-2'>
                        <p><b>Submitted rating:</b> {submission.Rating ?? 'None'}</p>
                        {outlierText &&
                            <span className='bg-yellow-400 text-black px-2 py-1'>{outlierText}</span>
                        }
                        <p><b>Submitted enjoyment:</b> {submission.Enjoyment ?? 'None'}</p>
                    </div>
                    <div className='mb-2'>
                        <p><b>Would deviate by:</b> {standardDeviations?.toFixed(1) ?? '-'}σ</p>
                        <p><b>Weight:</b> {weight ?? '-'}</p>
                    </div>
                    <div className='mb-2'>
                        <p><i className='bx bx-devices' /> <b>Device:</b> {submission.Device}</p>
                        <p><i className='bx bx-refresh' /> <b>Refresh rate:</b> {submission.RefreshRate}</p>
                        <p><i className='bx bx-time-five' /> <b>Progress:</b> {submission.Progress}%</p>
                        <p><i className='bx bx-flag' /> <b>Attempts:</b> {submission.Attempts ?? 'Not specified'}</p>
                    </div>
                    <div>
                        <span className='font-bold'><i className='bx bx-movie' /> Proof: </span>
                        <span className='break-all group'>
                            {submission.Proof
                                ? <>
                                    <button onClick={onProofClick} className='underline'>{submission.Proof} <i className='bx bx-link-external' /></button>
                                    <br />
                                    {!isProofClicked && <span className='bg-yellow-400 text-black px-1'>View proof to accept!</span>}
                                </>
                                : 'None'
                            }
                        </span>
                    </div>
                    {submission.IsSolo
                        ? submission.Level.Meta.IsTwoPlayer && <p>Completed solo</p>
                        : <p>Completed with {submission.SecondPlayerID ?? 'an unregistered user'}</p>
                    }
                </div>
                <div>
                    <Heading4 className='mb-2'>Level info</Heading4>
                    <p><b>Rating:</b> {(submission.IsSolo ? submission.Level.Rating : submission.Level.TwoPlayerRating)?.toFixed(2) ?? 'None'}</p>
                    <p><b>Deviation:</b> {(submission.IsSolo ? submission.Level.Deviation : submission.Level.TwoPlayerDeviation)?.toFixed(2) ?? 0}</p>
                    <p><b>Rating count:</b> {submission.Level.RatingCount}</p>
                    <p className='mb-1'><b>Length:</b> {levelLengthToString(submission.Level.Meta.Length)}</p>
                    <TonalButton onClick={() => onFilter(submission.LevelID)} size={'xs'}>Filter queue by this level</TonalButton>
                </div>
                <div>
                    <Heading4 className='mb-2'>Level after accept</Heading4>
                    <p><b>New rating:</b> {newLevelRating?.toFixed(2) ?? '-'}</p>
                    <p><b>New deviation:</b> {newSTDDev?.toFixed(2) ?? 0}</p>
                </div>
            </div>
            <div className='mt-4 flex justify-evenly max-md:flex-col max-md:gap-4'>
                <FilledButton sizeVariant='md' disabled={submission.Proof !== null && !isProofClicked} className='px-3 py-2' onClick={() => approveSubmission(submission.ID, submission.LevelID, submission.UserID, undefined, getProofReviewTime())}>Approve</FilledButton>
                {submission.Rating !== null && <TonalButton disabled={submission.Proof !== null && !isProofClicked} className='px-3 py-2' onClick={() => approveSubmission(submission.ID, submission.LevelID, submission.UserID, true, getProofReviewTime())}>Only enjoyment</TonalButton>}
                <button className='h-14 flex items-center px-7 text-xl rounded-[28px] hover:bg-button-danger-1 active:rounded-lg transition-all bg-button-danger-3 text-white' onClick={() => showDenyModal(submission)}>Deny</button>
                <Link to={`/mod/manageUser/${submission.UserID}`} className='h-14 flex items-center px-7 text-xl rounded-[28px] hover:bg-button-danger-1 active:rounded-lg transition-all bg-button-danger-3 text-white'>Mod view</Link>
            </div>
        </li>
    );
}
