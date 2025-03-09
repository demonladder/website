import { Link, Outlet } from 'react-router-dom';
import Container from '../../components/Container';
import { Suspense } from 'react';
import { NavButton } from '../../components/ui/NavButton';

export default function Mod() {
    return (
        <Container>
            <div className='grid grid-cols-12 gap-5'>
                <div id='mod-menu' className='col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col'>
                    <Link to='/mod' className='text-4xl mb-2'>Dashboard</Link>
                    <NavButton to='/mod/roles'>Roles</NavButton>
                    <hr className='my-2' />
                    <div className='flex flex-col select-none'>
                        <p className='text-gray-400 text-sm ps-3'>Submissions</p>
                        <NavButton to='/mod/queue'>Submissions queue</NavButton>
                        <NavButton to='/mod/addSubmission'>Add submission</NavButton>
                        <NavButton to='/mod/editSubmission'>Edit submission</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>Users</p>
                        <NavButton to='/mod/manageUser'>Manage user</NavButton>
                        <NavButton to='/mod/signupLinks'>Sign-up links</NavButton>
                        <NavButton to='/mod/createUser'>Create user</NavButton>
                        <NavButton to='/mod/deleteUser'>Delete user</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>Packs</p>
                        <NavButton to='/mod/editPack'>Packs</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>References</p>
                        <NavButton to='/mod/references'>Edit references</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>Levels</p>
                        <NavButton to='/mod/addLevel'>Add/update level</NavButton>
                        <NavButton to='/mod/editLevel'>Edit level</NavButton>
                        <NavButton to='/mod/editTags'>Edit tags</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>Settings</p>
                        <NavButton to='/mod/siteSettings'>Site settings</NavButton>
                        <NavButton to='/mod/debugging'>Debugging</NavButton>
                        <NavButton to='/mod/logs'>Logs</NavButton>
                    </div>
                </div>
                <div className='col-span-12 lg:col-span-8 xl:col-span-9'>
                    <div className='bg-gray-700 p-4 round:rounded-xl relative'>
                        <Suspense fallback={<p>Loading...</p>}>
                            <Outlet />
                        </Suspense>
                    </div>
                </div>
            </div>
        </Container>
    );
}
