import { Link } from 'react-router-dom';
import { SubmissionQueueInfo } from '../../../api/submissions';
import { useQuery } from '@tanstack/react-query';
import { GetShortLevel } from '../../../api/levels';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import toFixed from '../../../utils/toFixed';

type Props = {
    info: SubmissionQueueInfo,
    approve: (submission: SubmissionQueueInfo) => void,
    remove: (submission: SubmissionQueueInfo) => void,
}

export default function Submission({ info, approve, remove }: Props) {
    const { data: levelData } = useQuery({
        queryKey: ['levels', info.LevelID],
        queryFn: () => GetShortLevel(info.LevelID),
    });

    return (
        <div className={`round:rounded-2xl tier-${Math.round(info.ActualRating) || 0} p-3 my-2 text-lg`}>
            <div className='mb-3'>
                <Link to={`/level/${info.LevelID}`} className='text-2xl font-bold underline'>{levelData?.Name || info.LevelID} <span className='text-lg font-normal'>by {info.Creator}</span></Link>
                <p>Submitted by <a href={`/profile/${info.UserID}`} className='font-bold underline' target='_blank' rel='noopener noreferrer'>{info.UserName}</a></p>
                <p>Submitted at {info.DateAdded + ' UTC'}</p>
            </div>
            <div className='mb-3'>
                <div className='mb-2'>
                    <span className='font-bold'>Actual rating: </span>
                    <span>{toFixed(''+levelData?.Rating, 2, 'None')}</span>
                </div>
                <div>
                    <span className='font-bold'>Submitted rating: </span>
                    <span>{info.Rating || 'None'}</span>
                </div>
                <div className='mb-2'>
                    <span className='font-bold'>Submitted enjoyment: </span>
                    <span>{info.Enjoyment !== null ? info.Enjoyment : 'None'}</span>
                </div>
                <div>
                    <span className='font-bold'>Device: </span>
                    <span>{info.Device || 'None'}</span>
                </div>
                <div className='mb-2'>
                    <span className='font-bold'>Refresh rate: </span>
                    <span>{info.RefreshRate || 'None'}</span>
                </div>
                <div>
                    <span className='font-bold'>Proof: </span>
                    <span className='break-all'>
                        {info.Proof
                            ? <a href={info.Proof.startsWith('https') ? info.Proof : 'https://' + info.Proof} target='_blank' rel='noopener noreferrer'>{info.Proof}</a>
                            : 'None'
                        }
                    </span>
                </div>
            </div>
            <div className='flex justify-evenly'>
                <PrimaryButton className='px-3' onClick={() => approve(info)}>Approve</PrimaryButton>
                <DangerButton className='px-3' onClick={() => remove(info)}>Delete</DangerButton>
            </div>
        </div>
    );
}