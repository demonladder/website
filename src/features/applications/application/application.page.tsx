import { Link, useLoaderData } from 'react-router';
import Heading1 from '../../../components/headings/Heading1';
import Page from '../../../components/Page';
import { Application as IApplication } from '../../../api/types/Application';
import { TextInput, URLInput } from '../../../components/Input';
import FormGroup from '../../../components/form/FormGroup';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { useId, useState } from 'react';
import FilledButton from '../../../components/input/buttons/filled/FilledButton';
import FormInputDescription from '../../../components/form/FormInputDescription';
import { useMutation } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import Heading2 from '../../../components/headings/Heading2';
import { decodeDate } from '../../../utils/decodeDate';
import TonalButton from '../../../components/input/buttons/tonal/TonalButton';
import { copyText } from '../../../utils/copyText';
import TextArea from '../../../components/input/TextArea';
import Heading3 from '../../../components/headings/Heading3';
import Checkbox from '../../../components/input/CheckBox';
import { OAuth2Scopes } from '../../oauth2/authorize/oauth2-scopes';

export default function Application() {
    const app = useLoaderData<IApplication>();
    const [redirectURI, setRedirectURI] = useState<string>(app.redirectURI ?? '');
    const [secret, setSecret] = useState<string>();
    const [name, setName] = useState(app.name);
    const [description, setDescription] = useState(app.bot?.Introduction ?? '');
    const [scopes, setScopes] = useState('');

    const nameID = useId();
    const descriptionID = useId();

    const resetMutation = useMutation({
        mutationFn: async () => (await APIClient.post<string>(`/oauth/2/applications/${app.ID}/secret`)).data,
        onError: (error) => toast.error(renderToastError.render({ data: error })),
        onSuccess: (data) => {
            setSecret(data);
            toast.success('Secret reset');
        },
    });

    const oauth2URL = `${window.location.origin}/oauth2/authorize?client_id=${app.ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectURI)}${scopes ? `&scope=${scopes}` : ''}`;

    return (
        <Page>
            <Link to='/developer/applications' className='text-theme-400'>{'<- back'}</Link>
            <Heading1 className='mt-2'>{app.name}</Heading1>
            <p className='text-theme-400'>Created on {decodeDate(app.createdAt).toLocaleString()}</p>
            <section>
                <Heading2 className='mt-8 mb-4'>General information</Heading2>
                <div className='grid grid-cols-4 gap-2'>
                    <div>
                        <p><b>Application ID</b></p>
                        <p className='mb-1'>{app.ID}</p>
                        <TonalButton size='xs' onClick={() => copyText(app.ID)}>Copy</TonalButton>
                    </div>
                    <div>
                        <p><b>Bot ID</b></p>
                        <p className='mb-1'>{app.botID}</p>
                        <TonalButton size='xs' onClick={() => copyText(app.botID.toString())}>Copy</TonalButton>
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
                <div className='flex justify-end mt-2 mb-8'><FilledButton sizeVariant='xs'>Save</FilledButton></div>
                <FormGroup>
                    <FormInputLabel>Secret</FormInputLabel>
                    <p className='bg-theme-950 px-2 py-1 outline rounded outline-white/15 font-mono'>{secret ?? '************************************************************************'}</p>
                    <FormInputDescription>Do not share this secret with anyone!</FormInputDescription>
                    <div className='flex justify-end gap-2 items-center'>
                        {secret && <p>Copy the secret now as it will dissappear when you leave this page</p>}
                        <TonalButton className='my-1' size='xs' onClick={() => resetMutation.mutate()}>Reset secret</TonalButton>
                    </div>
                </FormGroup>
            </section>
            <section>
                <Heading2 className='mt-8 mb-4'>OAuth</Heading2>
                <FormGroup>
                    <FormInputLabel>Redirect URI</FormInputLabel>
                    <URLInput value={redirectURI} onChange={(e) => setRedirectURI(e.target.value)} placeholder='Redirect URI...' />
                    <FormInputDescription>You must set a redirect URI in order for users to authorize your application!</FormInputDescription>
                    <div className='flex justify-end'><FilledButton className='mt-1' sizeVariant='xs' disabled={redirectURI === app.redirectURI}>Save</FilledButton></div>
                </FormGroup>
                <Heading3 className='mt-8 mb-4'>OAuth2 URL generator</Heading3>
                <div className='grid grid-cols-4 gap-2 my-4 bg-theme-700 p-2'>
                    {Object.values(OAuth2Scopes).map((scope) => (
                        <OAuth2Scope scope={scope} scopes={scopes} onChecked={() => setScopes((scopes + ' ' + scope).trim())} onUnchecked={() => setScopes(scopes.split(' ').filter((s) => s as OAuth2Scopes !== scope).join(' '))} />
                    ))}
                </div>
                <p className='bg-theme-950 px-2 py-1 outline rounded outline-white/15 font-mono break-all'>{oauth2URL}</p>
                <TonalButton size='xs' className='mt-1' onClick={() => copyText(oauth2URL)}>Copy</TonalButton>
            </section>
            <div className='flex justify-end'><button className='underline-t mt-8 text-red-400'>delete app</button></div>
        </Page>
    );
}

function OAuth2Scope({ onChecked, onUnchecked, scope, scopes }: { onChecked: () => void, onUnchecked: () => void, scope: OAuth2Scopes, scopes: string }) {
    return (
        <label className='flex gap-1 items-center'>
            <Checkbox checked={scopes.split(' ').includes(scope)} onChange={(e) => e.target.checked ? onChecked() : onUnchecked()} /> {scope}
        </label>
    );
}
