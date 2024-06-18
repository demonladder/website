import APIClient from '../APIClient';

export interface EdittableUser {
    introduction?: string | null;
    favoriteLevels?: string;
    leastFavoriteLevels?: string;
    minPref?: number | null;
    maxPref?: number | null;
}

export default async function SaveProfile(userID: number, user: EdittableUser) {
    return (await APIClient.put(`/user/${userID}`, user)).data;
}