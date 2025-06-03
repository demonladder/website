import { Outlet } from 'react-router-dom';
import { NavButton } from '../../components/ui/NavButton';
import Page from '../../components/Page';

export default function Settings() {
    return (
        <Page>
            <div className='flex max-xl:flex-col gap-8 xl:gap-4'>
                <div>{/*Extra div is required so the nested div doesn't shrink*/}
                    <div className='flex flex-col xl:w-80'>
                        <NavButton to='/settings/site'>Site settings</NavButton>
                        <NavButton to='/settings/profile'>Profile settings</NavButton>
                        <NavButton to='/settings/appearance'>Appearance</NavButton>
                        <NavButton to='/settings/submission'>Submission settings</NavButton>
                        <NavButton to='/settings/account'>Account settings</NavButton>
                        <NavButton to='/settings/developer'>Developer</NavButton>
                    </div>
                </div>
                <div className='grow'>
                    <Outlet />
                </div>
            </div>
        </Page>
    );
}
