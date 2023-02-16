import React from 'react';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';

export default function ProfileButtons({ user }) {
    return (
        (!user || !user.info) ? <LoginButton />
        : <ProfileButton user={user} />
    );
}