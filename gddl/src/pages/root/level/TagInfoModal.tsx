import { useState } from 'react';
import Modal from '../../../components/Modal';
import { SecondaryButton } from '../../../components/Button';
import { useQuery } from '@tanstack/react-query';
import { GetTags } from '../../../api/level/GetTags';

export default function TagInfoModal() {
    const [visible, setVisible] = useState(false);

    const { data } = useQuery({
        queryKey: ['tags'],
        queryFn: GetTags,
    });

    function openModal() {
        setVisible(true);
    }

    return (
        <>
            <i className='bx bx-info-circle cursor-pointer' onClick={openModal} />
            <Modal title='Skillset explanation' show={visible} onClose={() => setVisible(false)}>
                <Modal.Body>
                    <p>Tags describe the general skillsets that are present in this level.</p>
                    <p>You may vote on tags once you have an approved rating on this level.</p>
                    <p>The percent next to each tag shows the percent of voters who believe the tag applies to this level.</p>
                    <div className='divider my-4' />
                    <div>
                        <h4 className='text-xl font-bold'>Available skillsets:</h4>
                        <ul>{
                            data?.map((t) => (
                                <li className='mb-3' key={t.TagID}>
                                    <h5 className='text-lg'>{t.Name}</h5>
                                    <p className='text-base'>{t.Description}</p>
                                </li>
                            ))
                        }</ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex round:gap-1 float-right mb-4'>
                        <SecondaryButton onClick={() => setVisible(false)}>Close</SecondaryButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}