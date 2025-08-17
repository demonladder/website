import APIClient from '../../../../api/APIClient';

interface UpdateUserDTO {
    ID: number;
    name?: string;
    introduction?: string | null;
    pronouns?: string | null;
    countryCode?: string | null;
    hardest?: number | null;
    minPref?: number | null;
    maxPref?: number | null;
}

export async function saveProfile(userData: UpdateUserDTO) {
    await APIClient.patch(`/user/${userData.ID}`, userData);
}
