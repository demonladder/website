import APIClient from '../APIClient';
import DiscordUserData from '../types/DiscordUserData';
import Level from '../../features/level/types/Level';
import LevelMeta from '../../features/level/types/LevelMeta';
import Role from '../types/Role';
import Song from '../../features/level/types/Song';
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
    const res = await APIClient.get<MeResponse>('/user/me');
    return res.data;
}
