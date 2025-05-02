import APIClient from '../APIClient';

interface UpdateUserDTO {
    ID: number;
    name?: string;
    introduction?: string | null;
    pronouns?: string | null;
    countryCode?: string | null;
    hardest?: number | null;
    favoriteLevels?: number[] | null;
    leastFavoriteLevels?: number[] | null;
    minPref?: number | null;
    maxPref?: number | null;
}

export default async function SaveProfile(userData: UpdateUserDTO) {
    await APIClient.patch(`/user/${userData.ID}`, userData);
}
