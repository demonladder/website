import { Link, Outlet } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import ModalProvider from '../../context/ModalProvider';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { NavButton } from '../../components/ui/NavButton';
import { Suspense, useState } from 'react';
import ProfileButtons from '../../components/ProfileButtons';
import Divider from '../../components/divider/Divider';
import './adminLayout.css';
import FloatingLoadingSpinner from '../../components/FloatingLoadingSpinner';
import { useWindowSize } from 'usehooks-ts';

export default function AdminLayout() {
    const windowSize = useWindowSize();
    const [hideSidebar, setHideSidebar] = useState(windowSize.width < 1024);

    return (
        <QueryParamProvider adapter={ReactRouter6Adapter} options={{ updateType: 'replaceIn' }} >
            <ModalProvider>
                <div className='relative grid grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr] max-w-screen min-h-screen'>
                    <aside className={'row-span-3 bg-theme-950 text-theme-text sticky top-0 bottom-0 max-h-screen w-2xs transition-all' + (hideSidebar ? ' -ms-72' : '')}>
                        <div className='h-14 flex items-center justify-center border-b border-white/20'>
                            <p>GDDL Dashboard</p>
                        </div>
                        <div className='px-4 py-6 flex flex-col gap-2 sidebar-wrapper overflow-auto scrollbar-thin'>
                            <NavButton to='/mod' end={true}>Dashboard</NavButton>
                            <NavButton to='/mod/queue'>Queue</NavButton>
                            <Divider />
                            <p className='text-gray-400 text-sm ps-3'>Submissions</p>
                            <NavButton to='/mod/addSubmission'>Add submission</NavButton>
                            <NavButton to='/mod/editSubmission'>Edit submission</NavButton>
                            <NavButton to='/mod/mergeSubmissions'>Merge submissions</NavButton>
                            <Divider />
                            <p className='text-gray-400 text-sm ps-3'>Users</p>
                            <NavButton to='/mod/manageUser'>Manage user</NavButton>
                            <NavButton to='/mod/roles'>Roles</NavButton>
                            <NavButton to='/mod/signupLinks'>Sign-up links</NavButton>
                            <NavButton to='/mod/createUser'>Create user</NavButton>
                            <NavButton to='/mod/deleteUser'>Delete user</NavButton>
                            <NavButton to='/mod/verification'>Verification</NavButton>
                            <Divider />
                            <p className='text-gray-400 text-sm ps-3'>Moderation</p>
                            <NavButton to='/mod/audit-logs'>Audit logs</NavButton>
                            <NavButton to='/mod/beta'>Beta access</NavButton>
                            <Divider />
                            <p className='text-gray-400 text-sm ps-3'>Packs</p>
                            <NavButton to='/mod/editPack'>Packs</NavButton>
                            <Divider />
                            <p className='text-gray-400 text-sm ps-3'>References</p>
                            <NavButton to='/mod/references'>Edit references</NavButton>
                            <Divider />
                            <p className='text-gray-400 text-sm ps-3'>Levels</p>
                            <NavButton to='/mod/addLevel'>Add/update level</NavButton>
                            <NavButton to='/mod/editLevel'>Edit level</NavButton>
                            <NavButton to='/mod/editTags'>Edit tags</NavButton>
                            <Divider />
                            <p className='text-gray-400 text-sm ps-3'>Settings</p>
                            <NavButton to='/mod/siteSettings'>Site settings</NavButton>
                            <NavButton to='/mod/debugging'>Debugging</NavButton>
                        </div>
                    </aside>
                    <nav className='col-start-2 bg-theme-header text-theme-header-text px-6 h-14 flex items-center justify-between border-b border-theme-outline'>
                        <ul className='flex items-center'>
                            <li><button onClick={() => setHideSidebar((prev) => !prev)} className='flex items-center m-2 p-2'><i className='bx bx-menu' /></button></li>
                            <li><Link to='/' className='m-2 p-2'>Home</Link></li>
                            <li><Link to='/search' className='m-2 p-2'>Levels</Link></li>
                            <li><Link to='/packs' className='m-2 p-2'>Packs</Link></li>
                            <li><Link to='/settings/site' className='m-2 p-2'><i className='bx bxs-cog text-xl mt-2' /></Link></li>
                        </ul>
                        <ul>
                            <li><ProfileButtons size='small' /></li>
                        </ul>
                    </nav>
                    <main className='col-start-2 from-theme-bg-from to-theme-bg-to bg-linear-to-br text-theme-text p-6 relative'>
                        <Suspense fallback={<FloatingLoadingSpinner />}>
                            <Outlet />
                        </Suspense>
                    </main>
                    <footer className='col-start-2 h-14 bg-theme-footer text-theme-footer-text flex items-center px-6'>
                        <p>Footer ig</p>
                    </footer>
                </div>
            </ModalProvider>
        </QueryParamProvider>
    );
}
