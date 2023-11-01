import { Outlet } from 'react-router-dom';
import Container from '../../../components/Container';
import { NavButton } from '../../../components/ui/NavButton';

export default function Settings() {
    return (
        <Container>
            <div className='flex'>
                <div>{/*Extra div is required the nested div doesn't shrink*/}
                    <div className='flex flex-col w-80'>
                        <NavButton to='/settings/site'>Site settings</NavButton>
                        <NavButton to='/settings/profile'>Profile settings</NavButton>
                    </div>
                </div>
                <div className='mx-4 shrink'>
                    <Outlet />
                </div>
            </div>
        </Container>
    );
}