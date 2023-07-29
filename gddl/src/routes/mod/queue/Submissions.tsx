import { Link } from 'react-router-dom';
import { SubmissionQueueInfo } from '../../../api/submissions';
import { useQuery } from '@tanstack/react-query';
import { GetLevel } from '../../../api/levels';
import { DangerButton, PrimaryButton } from '../../../components/Button';

type Props = {
    info: SubmissionQueueInfo,
    approve: (submission: SubmissionQueueInfo) => void,
    remove: (submission: SubmissionQueueInfo) => void,
}

export default function Submission({ info, approve, remove }: Props) {
    const { data: levelData } = useQuery({
        queryKey: ['levels', info.LevelID],
        queryFn: () => GetLevel(info.LevelID),
    });

    return (
        <div className={`round:rounded-2xl tier-${Math.round(info.ActualRating) || 0} p-3 my-2`}>
            <div className='mb-3'>
                <Link to={`/level/${info.LevelID}`} className='text-lg font-bold underline'>{levelData?.Name || info.LevelID}</Link>
                <p>submitted by <a href={`/profile/${info.UserID}`} className='underline' target='_blank' rel='noopener noreferrer'>{info.UserName}</a></p>
                <p>Submitted at {new Date(info.DateAdded).toUTCString()}</p>
            </div>
            <div className='mb-3'>
                <p>{'Submitted rating: ' + (info.Rating || 'None')}</p>
                <p>{'Actual rating: ' + (levelData?.Rating || 'None')}</p>
                <p>{'Submitted enjoyment: ' + (info.Enjoyment || 'None')}</p>
                <p>{'Device: ' + info.Device || 'None'}</p>
                <p>{'Refresh Rate: ' + (info.RefreshRate || 'None')}</p>
                <p>Proof: {info.Proof ? <a href={info.Proof} target='_blank' rel='noopener noreferrer'>{info.Proof}</a> : 'None'}</p>
            </div>
            <div className='flex justify-evenly'>
                <PrimaryButton className='px-3' onClick={() => approve(info)}>Approve</PrimaryButton>
                <DangerButton className='px-3' onClick={() => remove(info)}>Delete</DangerButton>
            </div>
        </div>
    );
}