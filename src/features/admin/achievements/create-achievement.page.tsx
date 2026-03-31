import { useState, type SubmitEvent } from 'react';
import { FormGroup, FormInputLabel } from '../../../components/form';
import { Heading1 } from '../../../components/headings';
import { TextInput } from '../../../components/shared/input/Input';
import { PrimaryButton } from '../../../components/ui/buttons';
import { useMutation } from '@tanstack/react-query';
import { createAchievement, type CreateAchievementRequest } from './api/createAchievement';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import renderToastError from '../../../utils/renderToastError';

export function CreateAchievement() {
    const [name, setName] = useState('');
    const [discordRoleId, setDiscordRoleId] = useState('');
    const [iconSource, setIconSource] = useState('');

    const createMutation = useMutation({
        mutationFn: (request: CreateAchievementRequest) => createAchievement(request),
        onMutate: () => toast.loading('Creating...'),
        onSuccess: (_data, _vars, toastId) => {
            toast.update(toastId, { render: 'Created', type: 'success', isLoading: false, autoClose: 5000 });
        },
        onError: (error: AxiosError, _vars, toastId) => renderToastError.error(toastId!, error),
    });

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        if (name.trim().length === 0) return toast.error("Name can't be empty");

        createMutation.mutate({
            name: name.trim(),
            discordRoleId: discordRoleId.trim() || undefined,
            iconSource: iconSource.trim() || undefined,
        });
    };

    return (
        <div>
            <Heading1>Create Achievement</Heading1>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormInputLabel htmlFor='achievementName'>Name</FormInputLabel>
                    <TextInput
                        id='achievementName'
                        placeholder='Achievement name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormInputLabel htmlFor='discordRoleId'>Discord role ID</FormInputLabel>
                    <TextInput
                        id='discordRoleId'
                        placeholder='Discord role ID'
                        value={discordRoleId}
                        onChange={(e) => setDiscordRoleId(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormInputLabel htmlFor='iconUrl'>Icon URL</FormInputLabel>
                    <TextInput
                        id='iconSource'
                        placeholder='Icon URL'
                        value={iconSource}
                        onChange={(e) => setIconSource(e.target.value)}
                    />
                </FormGroup>
                <div className='mt-4'>
                    <PrimaryButton type='submit' className='float-right'>
                        Create
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
