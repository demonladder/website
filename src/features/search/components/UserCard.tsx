import { Link } from 'react-router';
import { UserCircle } from '@boxicons/react';
import type { UserWithRoles } from '../../../api/user/searchUsers';

export function UserCard({ user }: { user: UserWithRoles }) {
    const nameColor = user.roles[0]?.Color ? '#' + user.roles[0].Color.toString(16).padStart(6, '0') : 'currentcolor';

    return (
        <li
            className='bg-theme-700 border border-theme-600 p-2 rounded-xl overflow-hidden grid grid-rows-subgrid row-span-2 gap-1'
            key={user.ID}
        >
            <Link to={`/profile/${user.ID}`} className='flex align-middle gap-2'>
                {user.avatar ? (
                    <img
                        src={`https://cdn.gdladder.com/avatars/${user.ID}/${user.avatar}.png`}
                        className='rounded-full inline-block'
                        width={36}
                        height={36}
                    />
                ) : (
                    <UserCircle pack='filled' size='md' />
                )}
                <span className='self-center text-xl' style={{ color: nameColor }}>
                    {user.Name}
                </span>
            </Link>
            <p className='text-theme-400 h-18 overflow-hidden'>
                {(user.Introduction?.slice(0, 100) ?? 'No introduction') +
                    (user.Introduction && user.Introduction.length > 100 ? '...' : '')}
            </p>
        </li>
    );
}
