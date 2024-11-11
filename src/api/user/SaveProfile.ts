import APIClient from '../APIClient';

export interface EdittableUser {
    name?: string;
    introduction?: string | null;
    favoriteLevels?: string | null;
    leastFavoriteLevels?: string | null;
    minPref?: number | null;
    maxPref?: number | null;
}

export default async function SaveProfile(userID: number, user: EdittableUser) {
    await APIClient.patch(`/user/${userID}`, user);
}