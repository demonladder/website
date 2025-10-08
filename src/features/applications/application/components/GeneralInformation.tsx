import { useId, useState } from 'react';
import FormGroup from '../../../../components/form/FormGroup';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import Heading2 from '../../../../components/headings/Heading2';
import { TextInput } from '../../../../components/Input';
import TextArea from '../../../../components/input/TextArea';
import { useLoaderData } from 'react-router';
import type { Application } from '../../../../api/types/Application';
import { copyText } from '../../../../utils/copyText';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../../../api/APIClient';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { SecondaryButton } from '../../../../components/ui/buttons/SecondaryButton';

export default function GeneralInformation() {
    const app = useLoaderData<Application>();
    const [secret, setSecret] = useState<string>();
    const [name, setName] = useState(app.name);
    const [description, setDescription] = useState(app.bot?.Introduction ?? '');
    const queryClient = useQueryClient();

    const nameID = useId();
    const descriptionID = useId();

    const updateMutation = useMutation({
        mutationFn: async () => (await APIClient.patch<Application>(`/oauth/2/applications/${app.ID}`, { name, description })).data,
        onError: (error) => toast.error(renderToastError.render({ data: error })),
        onSuccess: (data) => {
            queryClient.setQueryData(['applications', app.ID], data);
            toast.success('Application updated');
        },
    });

    const resetMutation = useMutation({
        mutationFn: async () => (await APIClient.post<string>(`/oauth/2/applications/${app.ID}/secret`)).data,
        onError: (error) => toast.error(renderToastError.render({ data: error })),
        onSuccess: (data) => {
            setSecret(data);
            toast.success('Secret reset');
        },
    });

    return (
        <section>
            <Heading2 className='mt-8 mb-4'>General information</Heading2>
            <div className='grid grid-cols-4 gap-2'>
                <div>
                    <p><b>Application ID</b></p>
                    <p className='mb-1'>{app.ID}</p>
                    <SecondaryButton onClick={() => copyText(app.ID)}>Copy</SecondaryButton>
                </div>
                <div>
                    <p><b>Bot ID</b></p>
                    <p className='mb-1'>{app.botID}</p>
                    <SecondaryButton onClick={() => copyText(app.botID.toString())}>Copy</SecondaryButton>
                </div>
            </div>
            <FormGroup>
                <FormInputLabel htmlFor={nameID}>Name</FormInputLabel>
                <TextInput value={name} onChange={(e) => setName(e.target.value)} id={nameID} />
            </FormGroup>
            <FormGroup>
                <FormInputLabel htmlFor={descriptionID}>Description</FormInputLabel>
                <TextArea value={description} onChange={(e) => setDescription(e.target.value)} id={descriptionID} />
                <FormInputDescription>The description is shown on the bot's profile.</FormInputDescription>
            </FormGroup>
            <div className='flex justify-end mt-2 mb-8'><PrimaryButton onClick={() => updateMutation.mutate()}>Save</PrimaryButton></div>
            <FormGroup>
                <FormInputLabel>Secret</FormInputLabel>
                <div className='flex gap-2 items-center'>
                    <p className='grow bg-theme-950 px-2 py-1 outline rounded outline-white/15 font-mono'>{secret ?? '************************************************************************'}</p>
                    <SecondaryButton className='my-1' onClick={() => resetMutation.mutate()}>Reset secret</SecondaryButton>
                </div>
                <FormInputDescription>Do not share this secret with anyone!</FormInputDescription>
                {secret && <p>Copy the secret now as it will dissappear when you leave this page</p>}
            </FormGroup>
        </section>
    );
}
