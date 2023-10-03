import { useState } from 'react';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import PackSearchBox from '../../../components/PackSearchBox';
import Modal from '../../../components/Modal';
import DeletePackRequest from '../../../api/pack/requests/DeletePackRequest';
import PackResponse from '../../../api/pack/responses/PackResponse';

export default function DeletePack() {
    const [packResult, setPackResult] = useState<PackResponse>();
    const [showConfirm, setShowConfirm] = useState(false);

    function submit() {
        if (!packResult) {
            return toast.error('Name can\'t be empty');
        }

        toast.promise(DeletePackRequest(packResult.ID), {
            pending: 'Deleting...',
            success: 'Deleted ' + packResult.Name,
            error: 'An error occurred',
        });
    }

    function handleClick() {
        if (packResult === undefined) return toast.error('Select a pack first!');

        setShowConfirm(true);
    }

    return (
        <div>
            <h3 className='mb-3 text-2xl'>Delete Pack</h3>
            <div>
                <label>Pack:</label>
                <PackSearchBox id='editPacksSearch' setResult={setPackResult} />
            </div>
            <DangerButton onClick={handleClick}>Delete</DangerButton>
            <Modal title='Are you sure?' show={showConfirm} onClose={() => setShowConfirm(false)}>
                <Modal.Body>
                    <div className='my-6'>
                        <p>This is an irreversible action!</p>
                        <p>The pack will be forever erased from existence!</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex float-right round:gap-1'>
                        <PrimaryButton onClick={() => setShowConfirm(false)}>Cancel</PrimaryButton>
                        <DangerButton onClick={submit}>Confirm</DangerButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}