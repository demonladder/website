import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DangerButton, PrimaryButton, SecondaryButton } from '../../../components/Button';
import Modal from '../../../components/Modal';
import { TextInput } from '../../../components/Input';
import TSubmission from '../../../api/types/Submission';
import { QueueSubmission } from '../../../api/pendingSubmissions/GetSubmissionQueue';
import { toast } from 'react-toastify';
import { useApproveClicked } from './useApproveClicked';

interface Props {
    submission: QueueSubmission;
    remove: (submission: TSubmission, reason?: string) => void;
}

export default function Submission({ submission, remove }: Props) {
    const [showDenyReason, setShowDenyReason] = useState(false);
    const reasonRef = useRef<HTMLInputElement>(null);

    const approveSubmission = useApproveClicked();

    return (
        <div className={`round:rounded-2xl tier-${submission.Level.Rating?.toFixed(0) || 0} p-3 my-2 text-lg`}>
            <div className='mb-3'>
                <Link to={`/level/${submission.LevelID}`} className='text-2xl font-bold underline'>{submission.Level.Meta.Name} <span className='text-lg font-normal'>by {submission.Level.Meta.Creator}</span></Link>
                <p>Submitted by <a href={`/profile/${submission.UserID}`} className='font-bold underline' target='_blank' rel='noopener noreferrer'>{submission.User.Name}</a></p>
                <p>Submitted at {submission.DateAdded + ' UTC'}</p>
            </div>
            <div className='mb-3'>
                <div className='mb-2'>
                    <p><b>Length:</b> {submission.Level.Meta.Length}</p>
                </div>
                <div className='mb-2'>
                    <p><b>Actual rating:</b> {submission.Level.Rating?.toFixed(2) ?? 'None'}</p>
                </div>
                <div className='mb-2'>
                    <p><b>Submitted rating:</b> {submission.Rating || 'None'}</p>
                    <p><b>Submitted enjoyment:</b> {submission.Enjoyment !== null ? submission.Enjoyment : 'None'}</p>
                </div>
                <div className='mb-2'>
                    <p><b>Device:</b> {submission.Device || 'None'}</p>
                    <p><b>Refresh rate:</b> {submission.RefreshRate || 'None'}</p>
                </div>
                <div>
                    <span className='font-bold'>Proof: </span>
                    <span className='break-all'>
                        {submission.Proof
                            ? <a href={submission.Proof.startsWith('https') ? submission.Proof : 'https://' + submission.Proof} target='_blank' rel='noopener noreferrer'>{submission.Proof}</a>
                            : 'None'
                        }
                    </span>
                </div>
            </div>
            <div className='flex justify-evenly max-md:flex-col max-md:gap-4'>
                <PrimaryButton className='px-3 py-2' onClick={() => approveSubmission(submission.LevelID, submission.UserID)}>Approve</PrimaryButton>
                <PrimaryButton className='px-3 py-2' onClick={() => approveSubmission(submission.LevelID, submission.UserID, true)}>Only enjoyment</PrimaryButton>
                <DangerButton className='px-3 py-2' onClick={() => setShowDenyReason(true)}>Deny</DangerButton>
                <DangerButton className='px-3 py-2' onClick={() => toast.error('Not implemented yet :(')}>Launch user into space</DangerButton>
            </div>
            <Modal title='Deny reason' show={showDenyReason} onClose={() => setShowDenyReason(false)}>
                <Modal.Body>
                    <TextInput ref={reasonRef} placeholder='Reason...' />
                    <p className='text-sm text-gray-400 w-96'>Optional</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex gap-2 justify-end'>
                        <SecondaryButton onClick={() => setShowDenyReason(false)}>Close</SecondaryButton>
                        <DangerButton onClick={() => { remove(submission, reasonRef.current?.value || undefined); setShowDenyReason(false); }}>Deny</DangerButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}