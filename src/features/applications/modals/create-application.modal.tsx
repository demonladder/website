import { useState } from 'react';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { TextInput } from '../../../components/Input';
import Modal from '../../../components/Modal';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import FormGroup from '../../../components/form/FormGroup';
import { useMutation } from '@tanstack/react-query';
import { createApplication } from '../api/createApplication';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import { useAPI } from '../../../hooks/useAPI';
import type { AxiosError } from 'axios';

interface Props {
    onClose: () => void;
}

export default function CreateApplicationModal({ onClose }: Props) {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const client = useAPI();

    const createMutation = useMutation({
        mutationFn: () => createApplication(client, name),
        onError(error: AxiosError) {
            if (error.response?.status !== 400) onClose();
            else toast.error(renderToastError.render({ data: error }));
        },
        onSuccess: (data) => {
            void navigate(`developer/applications/${data.ID}`);
            onClose();
        },
    });

    return (
        <Modal title='Create application' onClose={onClose} show>
            <FormGroup>
                <FormInputLabel>Name <span className='text-red-500'>*</span></FormInputLabel>
                <TextInput value={name} onChange={(e) => setName(e.target.value.trimStart())} required />
            </FormGroup>
            <div className='flex justify-end mt-2'>
                <PrimaryButton onClick={() => createMutation.mutate()}>Create</PrimaryButton>
            </div>
        </Modal>
    );
}
