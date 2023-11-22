import { useState } from 'react';
import Modal from '../../../components/Modal';
import { SecondaryButton } from '../../../components/Button';

export default function TagInfoModal() {
    const [visible, setVisible] = useState(false);

    function openModal() {
        setVisible(true);
    }

    return (
        <>
            <i className='bx bx-info-circle cursor-pointer' onClick={openModal} />
            <Modal title='Tag explanation thingy' show={visible} onClose={() => setVisible(false)}>
                <Modal.Body>
                    <p>Tags describe the general skillsets that are present in this level.</p>
                    <p>You may vote on tags once you have an approved rating on this level.</p>
                    <p>The percent next to each tag shows the percent of voters who believe the tag applies to this level.</p>
                    <div className='divider my-4' />
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex round:gap-1 float-right'>
                        <SecondaryButton onClick={() => setVisible(false)}>Close</SecondaryButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}