import { useState } from 'react';
import { useLoaderData } from 'react-router';
import type { Application } from '../../../../api/types/Application';
import Heading2 from '../../../../components/headings/Heading2';
import FormGroup from '../../../../components/form/FormGroup';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import { URLInput } from '../../../../components/Input';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import Heading3 from '../../../../components/headings/Heading3';
import { OAuth2Scopes } from '../../../oauth2/authorize/oauth2-scopes';
import { SecondaryButton } from '../../../../components/ui/buttons/SecondaryButton';
import Checkbox from '../../../../components/input/CheckBox';
import { copyText } from '../../../../utils/copyText';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../../../api/APIClient';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';

export default function OAuth() {
    const app = useLoaderData<Application>();
    const [redirectURI, setRedirectURI] = useState<string>(app.redirectURI ?? '');
    const [scopes, setScopes] = useState('');
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: async () => (await APIClient.put<Application>(`/oauth/2/applications/${app.ID}/redirect-uri`, { redirectURI })).data,
        onError: (error) => toast.error(renderToastError.render({ data: error })),
        onSuccess: (data) => {
            queryClient.setQueryData<Application>(['applications', app.ID], (prev) => ({ ...prev, ...data }));
            toast.success('Redirect URI updated');
        },
    });

    const oauth2URL = `${window.location.origin}/oauth2/authorize?client_id=${app.ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectURI)}${scopes ? `&scope=${scopes}` : ''}`;

    return (
        <section>
            <Heading2 className='mt-8 mb-4'>OAuth</Heading2>
            <FormGroup>
                <FormInputLabel>Redirect URI</FormInputLabel>
                <URLInput value={redirectURI} onChange={(e) => setRedirectURI(e.target.value)} placeholder='Redirect URI...' />
                <FormInputDescription>You must set a redirect URI in order for users to authorize your application!</FormInputDescription>
                <div className='flex justify-end'><PrimaryButton onClick={() => updateMutation.mutate()} className='mt-1' disabled={redirectURI === app.redirectURI}>Save</PrimaryButton></div>
            </FormGroup>
            <Heading3 className='mt-8 mb-4'>OAuth2 URL generator</Heading3>
            <div className='grid grid-cols-4 gap-2 my-4 bg-theme-700 p-2'>
                {Object.values(OAuth2Scopes).map((scope) => (
                    <OAuth2Scope scope={scope} scopes={scopes} onChecked={() => setScopes((scopes + ' ' + scope).trim())} onUnchecked={() => setScopes(scopes.split(' ').filter((s) => s as OAuth2Scopes !== scope).join(' '))} />
                ))}
            </div>
            <p className='bg-theme-950 px-2 py-1 outline rounded outline-white/15 font-mono break-all'>{oauth2URL}</p>
            <SecondaryButton className='mt-1' onClick={() => copyText(oauth2URL)}>Copy</SecondaryButton>
        </section>
    );
}

function OAuth2Scope({ onChecked, onUnchecked, scope, scopes }: { onChecked: () => void, onUnchecked: () => void, scope: OAuth2Scopes, scopes: string }) {
    return (
        <label className='flex gap-1 items-center'>
            <Checkbox checked={scopes.split(' ').includes(scope)} onChange={(e) => e.target.checked ? onChecked() : onUnchecked()} /> {scope}
        </label>
    );
}
