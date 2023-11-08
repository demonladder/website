import { Outlet } from 'react-router-dom';
import Container from '../../../components/Container';
import { NavButton } from '../../../components/ui/NavButton';

export default function Settings() {
    return (
        <Container>
            <div className='flex max-xl:flex-col max-xl:gap-8'>
                <div>{/*Extra div is required so the nested div doesn't shrink*/}
                    <div className='flex flex-col xl:w-80'>
                        <NavButton to='/settings/site'>Site settings</NavButton>
                        <NavButton to='/settings/profile'>Profile settings</NavButton>
                        <NavButton to='/settings/submission'>Submission settings</NavButton>
                    </div>
                </div>
                <div className='mx-4 shrink'>
                    <Outlet />
                </div>
            </div>
        </Container>
    );
}