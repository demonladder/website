import APIClient from '../APIClient';
import DiscordUserData from '../types/DiscordUserData';

export default async function GetDiscordUser(userID: number) {
    const res = await APIClient.get<DiscordUserData>(`/user/${userID}/discord`);
    return res.data;
}