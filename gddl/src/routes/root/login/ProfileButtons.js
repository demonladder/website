import React from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import serverIP from './../../../serverIP';

export default function ProfileButtons() {
    const userID = Cookies.get('userID');
    const { status, data: user } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => {
            if (!userID) return new Promise((resolve) => resolve(null));
            return fetch(`${serverIP}/getUser?userID=${userID}&all=true`).then(res => res.json())
        }
    });

    if (status === 'loading') {
        return <LoadingSpinner isLoading={true} />;
    }

    return (
        (!user || !user.info) ? <LoginButton />
        : <ProfileButton user={user} />
    );
}