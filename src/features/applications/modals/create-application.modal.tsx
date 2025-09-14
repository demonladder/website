import { useState } from 'react';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { TextInput } from '../../../components/Input';
import Modal from '../../../components/Modal';
import FilledButton from '../../../components/input/buttons/filled/FilledButton';
import FormGroup from '../../../components/form/FormGroup';
import { useMutation } from '@tanstack/react-query';
import { createApplication } from '../api/createApplication';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';

interface Props {
    onClose: () => void;
}

export default function CreateApplicationModal({ onClose }: Props) {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const createMutation = useMutation({
        mutationFn: () => createApplication(name),
        onError(error) {
            toast.error(renderToastError.render({ data: error }));
        },
        onSuccess: (data) => {
            void navigate(`${data.ID}`);
        },
    });

    return (
        <Modal title='Create application' onClose={onClose} show>
            <FormGroup>
                <FormInputLabel>Name <span className='text-red-500'>*</span></FormInputLabel>
                <TextInput value={name} onChange={(e) => setName(e.target.value.trimStart())} required />
            </FormGroup>
            <div className='flex justify-end mt-2'>
                <FilledButton sizeVariant='xs' onClick={() => createMutation.mutate()}>Create</FilledButton>
            </div>
        </Modal>
    );
}
