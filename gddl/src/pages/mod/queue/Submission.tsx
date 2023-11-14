import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SubmissionQueueInfo } from '../../../api/submissions';
import { useQuery } from '@tanstack/react-query';
import { GetShortLevel } from '../../../api/levels';
import { DangerButton, PrimaryButton, SecondaryButton } from '../../../components/Button';
import toFixed from '../../../utils/toFixed';
import Modal from '../../../components/Modal';
import { TextInput } from '../../../components/Input';

type Props = {
    info: SubmissionQueueInfo,
    approve: (submission: SubmissionQueueInfo, onlyEnjoyment?: boolean) => void,
    remove: (submission: SubmissionQueueInfo, reason?: string) => void,
}

export default function Submission({ info, approve, remove }: Props) {
    const [showDenyReason, setShowDenyReason] = useState(false);
    const reasonRef = useRef<HTMLInputElement>(null);
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
            <div className='flex justify-evenly max-md:flex-col'>
                <PrimaryButton className='px-3' onClick={() => approve(info)}>Approve</PrimaryButton>
                <PrimaryButton className='px-3' onClick={() => approve(info, true)}>Only enjoyment</PrimaryButton>
                <DangerButton className='px-3' onClick={() => setShowDenyReason(true)}>Delete</DangerButton>
            </div>
            <Modal title='Deny reason' show={showDenyReason} onClose={() => setShowDenyReason(false)}>
                <Modal.Body>
                    <TextInput ref={reasonRef} placeholder='Reason...' />
                    <p className='text-sm text-gray-400 w-96'>Optional</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex gap-2 justify-end'>
                        <SecondaryButton onClick={() => setShowDenyReason(false)}>Close</SecondaryButton>
                        <DangerButton onClick={() => { remove(info, reasonRef.current?.value || undefined); setShowDenyReason(false); }}>Deny</DangerButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}