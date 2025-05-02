import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import Modal from '../../../components/Modal';
import { TextInput } from '../../../components/Input';
import { QueueSubmission } from '../../../api/pendingSubmissions/GetSubmissionQueue';
import { useApproveClicked } from './useApproveClicked';
import Select from '../../../components/Select';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { levelLengthToString } from '../../../api/types/LevelMeta';

interface Props {
    submission: QueueSubmission;
    remove: (submission: QueueSubmission, reason?: string) => void;
}

const denyReasons = {
    'missingProof': 'Missing proof',
    'wrongProof': 'Wrong proof',
    'inaccessibleProof': 'Inaccessible proof',
    'noEndscreen': 'No endscreen',
    'incompleteRun': 'Doesn\'t show the entire run',
    'missingClicks': 'Missing/incoherent clicks',
    'hacked': 'Hacked',
    'fakeAccount': 'Fake account',
    'custom': 'Other',
};
type DenyReason = keyof typeof denyReasons;

export default function Submission({ submission, remove }: Props) {
    const [showDenyReason, setShowDenyReason] = useState(false);
    const [denyReason, setDenyReason] = useState<DenyReason>('custom');
    const reasonRef = useRef<HTMLInputElement>(null);

    const standardDeviations = Math.abs((submission.Level.Rating ?? submission.Rating ?? 0) - (submission.Rating ?? submission.Level.Rating ?? 0)) / (submission.Level.Deviation ?? 1);

    const navigate = useNavigate();
    const approveSubmission = useApproveClicked();

    function onDeny() {
        remove(submission, denyReason !== 'custom' ? denyReasons[denyReason] : (reasonRef.current?.value || undefined));
        setShowDenyReason(true);
    }

    return (
        <li className={`round:rounded-2xl tier-${submission.Rating ?? 0} p-3 my-2 text-lg`}>
            <div className='mb-3'>
                <Link to={`/level/${submission.LevelID}`} className='text-2xl font-bold underline'>{submission.Level.Meta.Name} <span className='text-lg font-normal'>by {submission.Level.Meta.Creator}</span></Link>
                <p>Submitted by <a href={`/profile/${submission.UserID}`} className='font-bold group' target='_blank' rel='noopener noreferrer'>{submission.User.Name} <i className='bx bx-link-external' /></a></p>
                <p>Submitted at {submission.DateAdded.replace('+00:00', 'UTC')}</p>
            </div>
            <div className='mb-3'>
                <div className='mb-2'>
                    <p><b>Length:</b> {levelLengthToString(submission.Level.Meta.Length)}</p>
                </div>
                <div className='mb-2'>
                    <p><b>Actual rating:</b> {submission.Level.Rating?.toFixed(2) ?? 'None'}</p>
                </div>
                <div className='mb-2'>
                    
                    <p><b>Submitted rating:</b> {submission.Rating ?? 'None'} {standardDeviations > 3 &&
                        <span className='bg-yellow-400 text-black px-2 py-1'>Caution: possible outlier detected!!!</span>
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
                            ? <a href={submission.Proof.startsWith('https') ? submission.Proof : 'https://' + submission.Proof} target='_blank' rel='noopener noreferrer' className='underline'>{submission.Proof} <i className='bx bx-link-external' /></a>
                            : 'None'
                        }
                    </span>
                </div>
            </div>
            <div className='flex justify-evenly max-md:flex-col max-md:gap-4'>
                <PrimaryButton className='px-3 py-2' onClick={() => approveSubmission(submission.ID, submission.LevelID, submission.UserID)}>Approve</PrimaryButton>
                <PrimaryButton className='px-3 py-2' onClick={() => approveSubmission(submission.ID, submission.LevelID, submission.UserID, true)}>Only enjoyment</PrimaryButton>
                <DangerButton className='px-3 py-2' onClick={() => setShowDenyReason(true)}>Deny</DangerButton>
                <DangerButton className='px-3 h- py-2' onClick={() => navigate(`/mod/manageUser/${submission.UserID}`)}>Launch user into space</DangerButton>
            </div>
            <Modal title='Deny reason' show={showDenyReason} onClose={() => setShowDenyReason(false)}>
                <div>
                    <FormGroup>
                        <FormInputLabel htmlFor='denyReason'>Select a type</FormInputLabel>
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
                </div>
                <div className='flex gap-2 justify-end'>
                    <SecondaryButton onClick={() => setShowDenyReason(false)}>Close</SecondaryButton>
                    <DangerButton onClick={() => onDeny()}>Deny</DangerButton>
                </div>
            </Modal>
        </li>
    );
}
