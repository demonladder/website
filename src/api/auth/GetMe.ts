import APIClient from '../APIClient';
import DiscordUserData from '../types/DiscordUserData';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';
import Role from '../types/Role';
import Song from '../types/Song';
import User from '../types/User';

interface MeResponse extends User {
    Hardest?: Level & {
        Meta: LevelMeta & {
            Song: Song,
        },
    },
    DiscordData: DiscordUserData | null,
    CompletedPacks: { PackID: number, IconName: string }[],
    PendingSubmissionCount: number,
    TotalSubmissions: number,
    Roles: Role[],
}

export default async function GetMe() {
    const res = await APIClient.get<MeResponse>('/auth/me');
    return res.data;
}
