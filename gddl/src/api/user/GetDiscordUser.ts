import APIClient from '../APIClient';
import DiscordUserData from '../types/DiscordUserData';

export async function GetDiscordUser(userID: number): Promise<DiscordUserData> {
    const res = await APIClient.get(`/user/${userID}/discord`);
    return res.data;
}