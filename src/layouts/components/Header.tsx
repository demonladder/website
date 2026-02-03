// import useUserSearch from '../../hooks/useUserSearch';
import Search from '../../components/input/search/Search';
import { useState } from 'react';
import { Link } from 'react-router';
import { useWindowSize } from 'usehooks-ts';
import ProfileButtons from '../../components/shared/ProfileButtons';

export default function Header() {
    // const navigate = useNavigate();
    const [text, setText] = useState('');
    // const userSearch = useUserSearch({
    //     ID: 'userSearchWide',
    //     onUserSelect: (user) => {
    //         void navigate(`/profile/${user.ID}`);
    //     },
    // });

    const windowSize = useWindowSize();

    return (
        <header className='bg-theme-header text-theme-header-text shadow-lg outline-b outline-theme-outline sticky top-0 left-0 right-0 z-20'>
            <nav className='pe-10 relative flex items-center justify-between'>
                <Link to='/' className='z-10'><img src='/banner.webp' width={windowSize.width >= 766 ? 300 : 262} /></Link>
                {/* <div className='ms-auto flex items-center gap-4'>
                    {userSearch.SearchBox}
                    </div> */}
                <ProfileButtons />
                <div className='absolute left-0 right-0 flex justify-center max-lg:hidden'>
                    <div className='w-sm xl:w-lg'>
                        <Search value={text} onChange={(e) => setText(e.target.value.trimStart().slice(0, 22))} autoFocus placeholder='What do you want to play?' />
                    </div>
                </div>
            </nav>
        </header>
    );
}
