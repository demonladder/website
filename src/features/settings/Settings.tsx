import { Outlet } from 'react-router';
import { NavButton } from '../../components/ui/NavButton';
import Page from '../../components/layout/Page';
import useSession from '../../hooks/useSession.ts';
import { CodeAlt, Link, Palette, User } from '@boxicons/react';

export default function Settings() {
    const session = useSession();

    return (
        <Page>
            <div className='flex max-xl:flex-col gap-8 xl:gap-4'>
                <div>
                    {/*Extra div is required so the nested div doesn't shrink*/}
                    <div className='flex flex-col xl:w-80'>
                        <NavButton to='/settings/site'>General</NavButton>
                        <NavButton to='/settings/profile'>Profile</NavButton>
                        <NavButton to='/settings/appearance' icon={<Palette />}>
                            Appearance
                        </NavButton>
                        <NavButton to='/settings/submission'>Submissions</NavButton>
                        {session.user && (
                            <>
                                <NavButton to='/settings/account' icon={<User />}>
                                    Account
                                </NavButton>
                                <NavButton to='/settings/connections' icon={<Link />}>
                                    Connections
                                </NavButton>
                                <div className='h-0 border-b border-theme-outline mx-4 my-2' />
                                <NavButton to='/settings/developer' icon={<CodeAlt />}>
                                    Developer
                                </NavButton>
                            </>
                        )}
                    </div>
                </div>
                <div className='grow'>
                    <Outlet />
                </div>
            </div>
        </Page>
    );
}
