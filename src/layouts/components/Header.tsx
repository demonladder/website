import Search from '../../components/input/search/Search';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useWindowSize } from 'usehooks-ts';
import ProfileButtons from '../../components/shared/ProfileButtons';
import { useShortcut } from 'react-keybind';

export default function Header() {
    const windowSize = useWindowSize();
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const ref = useRef<HTMLInputElement>(null);

    const { registerShortcut, unregisterShortcut } = useShortcut()!;
    useEffect(() => {
        const keybinds = ['ctrl+k', 'cmd+k'];
        registerShortcut(
            () => {
                if (window.location.pathname !== '/search') {
                    if (ref.current) {
                        ref.current.focus();
                        ref.current.select();
                    }
                }
            },
            keybinds,
            'Search',
            'Search levels',
        );

        return () => {
            unregisterShortcut(keybinds);
        };
    }, [registerShortcut, unregisterShortcut]);

    function onSearch(e: React.FormEvent) {
        e.preventDefault();
        if (text === '') {
            return;
        }

        sessionStorage.setItem('level-filters', JSON.stringify({ name: text }));
        void navigate(`/search?name=${encodeURIComponent(text)}`);
    }

    return (
        <header className='bg-theme-header text-theme-header-text shadow-lg outline-b outline-theme-outline sticky top-0 left-0 right-0 z-20'>
            <nav className='pe-10 relative flex items-center justify-between'>
                <Link to='/' className='z-10'>
                    <img src='/banner.webp' width={windowSize.width >= 766 ? 300 : 262} />
                </Link>
                <ProfileButtons />
                <div className='absolute left-0 right-0 flex justify-center max-lg:hidden'>
                    <form onSubmit={onSearch} className='w-sm xl:w-lg relative'>
                        <Search
                            ref={ref}
                            value={text}
                            onChange={(e) => setText(e.target.value.trimStart().slice(0, 22))}
                            autoFocus
                            placeholder='Search levels and users'
                        />
                        <p className='absolute pointer-events-none right-4 top-1/2 -translate-y-1/2 text-theme-400 text-xs outline rounded-md px-1'>
                            Ctrl + K
                        </p>
                    </form>
                </div>
            </nav>
        </header>
    );
}
