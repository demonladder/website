import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DangerButton, PrimaryButton, SecondaryButton } from '../../../components/Button';
import Modal from '../../../components/Modal';
import { TextInput } from '../../../components/Input';
import TSubmission from '../../../api/types/Submission';
import { QueueSubmission } from '../../../api/pendingSubmissions/GetSubmissionQueue';
import { useApproveClicked } from './useApproveClicked';
import Select from '../../../components/Select';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { levelLengthToString } from '../../../api/types/LevelMeta';

interface Props {
    submission: QueueSubmission;
    remove: (submission: TSubmission, reason?: string) => void;
}

const denyReasons: Record<string, string> = {
    'missingProof': 'Missing proof',
    'wrongProof': 'Wrong proof',
    'inaccessibleProof': 'Inaccessible proof',
    'noEndscreen': 'No endscreen',
    'incompleteRun': 'Doesn\'t show the entire run',
    'missingClicks': 'Missing/incoherent clicks',
    'hacked': 'Hacked',
    'fakeAccount': 'Fake account',
    'custom': 'Other',
}

export default function Submission({ submission, remove }: Props) {
    const [showDenyReason, setShowDenyReason] = useState(false);
    const [denyReason, setDenyReason] = useState('custom');
    const reasonRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

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
                    <p><b>Length:</b> {levelLengthToString(submission.Level.Meta.Length)}</p>
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
                    <p><b>Progress:</b> {submission.Progress ?? 'None'}</p>
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
                <DangerButton className='px-3 h- py-2' onClick={() => navigate(`/mod/userBans?userID=${submission.UserID}`)}>Launch user into space</DangerButton>
            </div>
            <Modal title='Deny reason' show={showDenyReason} onClose={() => setShowDenyReason(false)}>
                <Modal.Body>
                    <FormGroup>
                        <FormInputLabel>Select a type</FormInputLabel>
                        <Select id='denyReason' options={denyReasons} activeKey={denyReason} onChange={setDenyReason} height='36' />
                        <FormInputDescription>Choose a reason for denying the submission.</FormInputDescription>
                    </FormGroup>
                    {['custom', 'hacked'].includes(denyReason) &&
                        <FormGroup>
                            <FormInputLabel htmlFor='customDenyReason'>Write a reason</FormInputLabel>
                            <TextInput ref={reasonRef} id='customDenyReason' placeholder='Reason...' />
                            <FormInputDescription>Optional.</FormInputDescription>
                        </FormGroup>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex gap-2 justify-end'>
                        <SecondaryButton onClick={() => setShowDenyReason(false)}>Close</SecondaryButton>
                        <DangerButton onClick={() => { remove(submission, denyReason !== 'custom' ? denyReasons[denyReason] : (reasonRef.current?.value || undefined)); setShowDenyReason(false); }}>Deny</DangerButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}