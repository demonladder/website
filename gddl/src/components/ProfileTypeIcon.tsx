import * as React from 'react';
import { User } from '../api/users';

export default function ProfileTypeIcon({ user }: { user: User }) {
    switch(user.Type) {
        case 1: return <span className='m-0' title="GDDL List Helper" role='img' aria-label='Role icon'>📝</span>;
        case 2: return <span className='m-0' title="GDDL Developer" role='img' aria-label='Role icon'>🖥️</span>;
        case 3: return <span className='m-0' title="GDDL Moderator" role='img' aria-label='Role icon'>🔰</span>;
        case 4: return <span className='m-0' title="GDDL Admin" role='img' aria-label='Role icon'>🛡️</span>;
        case 5: return <span className='m-0' title="Owner of GDDL" role='img' aria-label='Role icon'>⭐</span>;
        default: return <></>;
    }
}