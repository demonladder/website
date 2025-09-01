import { useLoaderData } from 'react-router';
import FilledButton from '../../../components/input/buttons/filled/FilledButton';
import TonalButton from '../../../components/input/buttons/tonal/TonalButton';
import Checkbox from '../../../components/input/CheckBox';
import useSession from '../../../hooks/useSession';
import Heading1 from '../../../components/headings/Heading1';
import { StringParam, useQueryParam } from 'use-query-params';
import { OAuth2Scopes } from './oauth2-scopes';
import { useState } from 'react';

function PageWrapper({ children }: { children?: React.ReactNode }) {
    return (
        <div className='bg-theme-800 rounded-2xl text-theme-text p-4 border border-theme-700 shadow-xl max-sm:w-full sm:min-w-md'>
            {children}
        </div>
    );
}

export default function Authorize() {
    const session = useSession();
    const client = useLoaderData<{ name: string, botID: number, createdAt: string } | null>();
    const [clientID] = useQueryParam('client_id', StringParam);
    const [responseType] = useQueryParam('response_type', StringParam);
    const [scopes, setScopes] = useQueryParam('scope', StringParam);
    const [initialScope] = useState(scopes);

    if (!client) {
        return (
            <PageWrapper>
                <Heading1 className='text-center my-8'>Unknown application</Heading1>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className='flex justify-center gap-6 mb-4'>
                <img src={`/api/user/${client.botID}/pfp?size=80`} width='80' height='80' className='rounded-full' />
                <p className='self-center'>...</p>
                <img src={`/api/user/${session.user?.ID}/pfp?size=80`} width='80' height='80' className='rounded-full' />
            </div>
            <p className='text-center'><b>{client.name}</b></p>
            <p className='text-center'>wants to access your GDDL account</p>
            <div className='my-4 px-6 py-8 bg-theme-700 rounded-lg border border-theme-600 max-h-[380px] overflow-y-scroll scrollbar-thin'>
                <p>Authorizing will allow this application to:</p>
                <ul className='mt-3 flex flex-col gap-3'>
                    {initialScope?.split(' ').map((scope) =>
                        <Scope checked={scopes!.split(' ').includes(scope)} onChange={(checked) => checked ? setScopes([...scopes!.split(' '), scope].join(' ')) : setScopes(scopes!.split(' ').filter((s, _, arr) => s !== scope || arr.length === 1).join(' '))} scope={scope as OAuth2Scopes} key={scope} />,
                    )}
                    <li className='flex items-center gap-1'>
                        <Checkbox disabled />
                        <p className='text-gray-400'>Beat a new hardest for you</p>
                    </li>
                </ul>
            </div>
            <form className='grid grid-cols-2 gap-2' method='POST' action='/api/oauth/2/authorize'>
                {clientID && <input className='opacity-0 absolute' name='client_id' value={clientID} />}
                {responseType && <input className='opacity-0 absolute' name='response_type' value={responseType} />}
                {scopes && <input className='opacity-0 absolute' name='scope' value={scopes} />}
                <TonalButton size='sm' className='justify-center' type='button'>Cancel</TonalButton>
                <FilledButton sizeVariant='sm' type='submit'>Authorize</FilledButton>
            </form>
        </PageWrapper>
    );
}

const scopeLabels: Record<OAuth2Scopes, string> = {
    [OAuth2Scopes.SUBMISSIONS_WRITE]: 'Submit and edit submissions for you',
    [OAuth2Scopes.PROFILE_WRITE]: 'Update your profile',
    [OAuth2Scopes.FAVORITES_WRITE]: 'Change your favorite and least favorite levels',
    [OAuth2Scopes.LISTS_WRITE]: 'Create or edit your lists',
};

function Scope({ checked, onChange, scope }: { checked: boolean, onChange: (checked: boolean) => void, scope: OAuth2Scopes }) {
    return (
        <li className='flex items-center gap-1'>
            <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <p>{scopeLabels[scope] ?? scope}</p>
        </li>
    );
}
