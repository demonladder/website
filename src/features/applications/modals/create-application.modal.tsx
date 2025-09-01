import { useState } from 'react';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { TextInput } from '../../../components/Input';
import Modal from '../../../components/Modal';
import FilledButton from '../../../components/input/buttons/filled/FilledButton';
import FormGroup from '../../../components/form/FormGroup';

interface Props {
    onClose: () => void;
}

export default function CreateApplicationModal({ onClose }: Props) {
    const [name, setName] = useState('');

    return (
        <Modal title='Create application' onClose={onClose} show>
            <FormGroup>
                <FormInputLabel>Name <span className='text-red-500'>*</span></FormInputLabel>
                <TextInput value={name} onChange={(e) => setName(e.target.value.trimStart())} required />
            </FormGroup>
            <div className='flex justify-end mt-2'>
                <FilledButton sizeVariant='xs'>Create</FilledButton>
            </div>
        </Modal>
    );
}
