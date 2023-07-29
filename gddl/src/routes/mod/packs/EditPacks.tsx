import { NavLink, Outlet } from 'react-router-dom';

function NavButton({ to, children }: { to: string, children: React.ReactNode}) {
    return (
        <NavLink to={to} className={({ isActive }) => (isActive ? 'bg-gray-500' : 'hover:bg-gray-700') + ' text-center p-1 transition-colors select-none'}>{children}</NavLink>
    );
}

export default function EditPacks() {
    return (
        <div id='edit-packs'>
            <div className='mb-4'>
                <h3 className='text-2xl'>Edit packs</h3>
                {/* <p>Select an edit to perform. Once done, click the save button to push the changes.</p> */}
            </div>
            <div className='border-b grid grid-cols-3'>
                <NavButton to='add'>Add</NavButton>
                <NavButton to='remove'>Remove</NavButton>
                <NavButton to='move'>Move</NavButton>
            </div>
            <div className='bg-gray-700 p-3'>
                <Outlet />
            </div>
        </div>
    );
}