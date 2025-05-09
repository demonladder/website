import { Link, useNavigate } from 'react-router-dom';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { QueueSubmission } from '../../../api/pendingSubmissions/GetSubmissionQueue';
import { useApproveClicked } from './useApproveClicked';
import { levelLengthToString } from '../../../api/types/LevelMeta';
import useDenySubmissionModal from '../../../hooks/modals/useDenySubmissionModal';
import { useMemo, useState } from 'react';
import Heading4 from '../../../components/headings/Heading4';
import { DifficultyToImgSrc } from '../../../components/DemonLogo';
import { toast } from 'react-toastify';

interface Props {
    submission: QueueSubmission;
}

export default function Submission({ submission }: Props) {
    const showDenyModal = useDenySubmissionModal();
    const [isProofClicked, setIsProofClicked] = useState(false);
    const [proofClickedAt, setProofClickedAt] = useState<Date>();

    const levelRating = submission.IsSolo ? submission.Level.Rating : submission.Level.TwoPlayerRating;
    const standardDeviations = useMemo(() => {
        const rating = submission.Rating;
        const levelDeviation = submission.IsSolo ? submission.Level.Deviation : submission.Level.TwoPlayerDeviation;

        if (levelRating === null || rating === null || levelDeviation === null) return 0;
        if (submission.Level.RatingCount < 10) return 0;

        const difference = Math.abs(rating - levelRating);
        if (difference < 2) return 0;

        return difference / levelDeviation;
    }, [levelRating, submission.IsSolo, submission.Level.Deviation, submission.Level.RatingCount, submission.Level.TwoPlayerDeviation, submission.Rating]);

    const outlierText = useMemo(() => {
        if (standardDeviations <= 1.5) return '';
        if (standardDeviations <= 2) return 'Semi-outlier detected!';
        if (standardDeviations <= 3) return 'Outlier detected!';
        if (standardDeviations <= 5) return 'Outlier detected! (rating won\'t count)';
        return 'Possible troll detected!';
    }, [standardDeviations]);

    function onProofClick() {
        if (!submission.Proof) return toast.error('No proof URL provided');

        setIsProofClicked(true);
        setProofClickedAt(new Date());
        window.open(submission.Proof, '_blank', 'noopener,noreferrer');
    }

    function getProofReviewTime() {
        if (!proofClickedAt) return null;
        return new Date().getTime() - proofClickedAt.getTime();
    }

    const navigate = useNavigate();
    const approveSubmission = useApproveClicked();

    return (
        <li className={`round:rounded-2xl bg-linear-to-br tier-${submission.Rating ?? 0} from-tier-${submission.Rating ?? 0} to-tier-${levelRating?.toFixed() ?? 0} p-3 my-2 text-lg`}>
            <div className='mb-3'>
                <Link to={`/level/${submission.LevelID}`} className='text-2xl font-bold underline'>{submission.Level.Meta.Name} <span className='text-lg font-normal'>by {submission.Level.Meta.Creator}</span></Link>
                <p>Submitted by <a href={`/profile/${submission.UserID}`} className='font-bold group' target='_blank' rel='noopener noreferrer'>{submission.User.Name} <i className='bx bx-link-external' /></a></p>
                <p>Submitted at {submission.DateChanged.replace('+00:00', 'UTC')}</p>
            </div>
            <div className='grid grid-cols-2 gap-4 max-md:grid-cols-1'>
                <div>
                    <Heading4 className='mb-2'>Submission info</Heading4>
                    <div className='mb-2'>
                        <p><b>Submitted rating:</b> {submission.Rating ?? 'None'} {standardDeviations > 1.5 &&
                            <span className='bg-yellow-400 text-black px-2 py-1'>{outlierText}</span>
                        }</p>
                        <p><b>Submitted enjoyment:</b> {submission.Enjoyment ?? 'None'}</p>
                    </div>
                    <div className='mb-2'>
                        <p><b>Device:</b> {submission.Device}</p>
                        <p><b>Refresh rate:</b> {submission.RefreshRate}</p>
                        <p><b>Progress:</b> {submission.Progress ?? 'None'}</p>
                    </div>
                    <div>
                        <span className='font-bold'>Proof: </span>
                        <span className='break-all group'>
                            {submission.Proof
                                ? <button onClick={onProofClick} className='underline'>{submission.Proof} <i className='bx bx-link-external' /></button>
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
                    <p><b>Deviation:</b> {submission.Level.Deviation?.toFixed(2) ?? 0}</p>
                    <p><b>Rating count:</b> {submission.Level.RatingCount}</p>
                    <p><b>Length:</b> {levelLengthToString(submission.Level.Meta.Length)}</p>
                    <p><b>Difficulty:</b> <img src={DifficultyToImgSrc(submission.Level.Meta.Difficulty)} width='24' className='inline-block' /></p>
                </div>
            </div>
            <div className='mt-4 flex justify-evenly max-md:flex-col max-md:gap-4'>
                <PrimaryButton disabled={submission.Proof !== null && !isProofClicked} className='px-3 py-2' onClick={() => approveSubmission(submission.ID, submission.LevelID, submission.UserID, undefined, getProofReviewTime())}>Approve</PrimaryButton>
                <PrimaryButton disabled={submission.Proof !== null && !isProofClicked} className='px-3 py-2' onClick={() => approveSubmission(submission.ID, submission.LevelID, submission.UserID, true, getProofReviewTime())}>Only enjoyment</PrimaryButton>
                <DangerButton className='px-3 py-2' onClick={() => showDenyModal(submission)}>Deny</DangerButton>
                <DangerButton className='px-3 h- py-2' onClick={() => navigate(`/mod/manageUser/${submission.UserID}`)}>Mod view</DangerButton>
            </div>
        </li>
    );
}
