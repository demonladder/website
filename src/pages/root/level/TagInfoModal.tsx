import { useState } from 'react';
import Modal from '../../../components/Modal';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import { useTags } from '../../../hooks/api/tags/useTags';

export default function TagInfoModal() {
    const [visible, setVisible] = useState(false);

    const { data } = useTags();

    function openModal() {
        setVisible(true);
    }

    return (
        <>
            <i className='bx bx-info-circle cursor-pointer' onClick={openModal} />
            <Modal title='Skillset explanation' show={visible} onClose={() => setVisible(false)}>
                <div>
                    <p>Tags describe the general skillsets that are present in this level.</p>
                    <p>You may vote on tags once you have an approved submission for this level.</p>
                    <div className='divider my-4' />
                    <div>
                        <h4 className='text-xl font-bold'>Available skillsets:</h4>
                        <ul>{
                            data?.map((t) => (
                                <li className='mb-3' key={t.ID}>
                                    <h5 className='text-lg'>{t.Name}</h5>
                                    <p className='text-base'>{t.Description}</p>
                                </li>
                            ))
                        }</ul>
                    </div>
                </div>
                <div className='flex round:gap-1 float-right mb-4'>
                    <SecondaryButton onClick={() => setVisible(false)}>Close</SecondaryButton>
                </div>
            </Modal>
        </>
    );
}
