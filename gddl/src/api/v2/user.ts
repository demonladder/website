import { List } from '../../pages/root/list/List';
import APIClient from '../APIClient';

interface DiscordUserData {
    GDDLID: number;
    ID: string;
    Name: string | null;
    Username: string;
    Avatar: string | null;
    AccentColor: string | null;
}

export default interface User {
    ID: number;
    Name: string;
    PasswordHash: string | null;
    PermissionLevel: number;
    Hardest: number | null;
    Favorite: string | null;
    LeastFavorite: string | null;
    MinPref: number | null;
    MaxPref: number | null;
    Introduction: string | null;
    AverageEnjoyment: number | null;
    DiscordUserData?: DiscordUserData;
}

export async function GetUserLists(userID: number, order?: 'ID' | 'Name'): Promise<Omit<List, 'Levels'>[]> {
    const res = await APIClient.get(`/user/${userID}/lists`, { params: { sort: order } });
    return res.data;
}