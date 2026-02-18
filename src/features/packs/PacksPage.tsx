import { useQuery } from '@tanstack/react-query';
import Page from '../../components/layout/Page';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Heading1 } from '../../components/headings';
import Category from './components/Category';
import UserLink from '../../components/ui/UserLink';
import { getPacks } from './api/getPacks';
import Leaderboard from './components/Leaderboard';
import { TextInput } from '../../components/shared/input/Input';
import { useState } from 'react';

export default function Packs() {
    const { status, data: packs } = useQuery({
        queryKey: ['packs'],
        queryFn: getPacks,
    });
    const [name, setName] = useState('');

    if (status === 'pending')
        return (
            <Page title='Packs'>
                <LoadingSpinner />
            </Page>
        );
    if (status === 'error')
        return (
            <Page title='Packs'>
                <p>Error: could not fetch packs from server</p>
            </Page>
        );

    return (
        <Page title='Packs'>
            <section>
                <Heading1>Packs</Heading1>
                <p>
                    GDDL packs are collections of levels that share the same theme generally indicated by the pack name.
                    Completing all the non-extra levels in a pack will grant you a badge on your profile.
                </p>
                <p>
                    The pack icons were created by <UserLink userID={138} /> (@aamberette)
                </p>
                <div className='my-6'>
                    <TextInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Filter packs by name...'
                    />
                </div>
                {packs.categories.map((c) => (
                    <Category
                        category={c}
                        packs={packs.packs
                            .filter((p) => p.Name.toLowerCase().includes(name.toLowerCase()))
                            .filter((p) => p.CategoryID == c.ID)}
                        key={'packCategory_' + c.Name}
                    />
                ))}
            </section>
            <Leaderboard />
        </Page>
    );
}
