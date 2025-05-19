import APIClient from '../APIClient';
import DiscordUserData from '../types/DiscordUserData';
import Level from '../../features/level/types/Level';
import LevelMeta from '../../features/level/types/LevelMeta';
import Role from '../types/Role';
import Song from '../../features/level/types/Song';
import User from '../types/User';

export type UserResponse = User & {
    Hardest?: Level & { Meta: LevelMeta & { Song: Song } },
    DiscordData: DiscordUserData | null,
    CompletedPacks: { PackID: number, IconName: string }[],
    PendingSubmissionCount: number,
    SubmissionCount: number,
    TotalAttempts: number | null,
    Roles: Role[],
};

export default async function GetUser(userID: number): Promise<UserResponse> {
    const res = (await APIClient.get<UserResponse>(`/user/${userID}`)).data;
    return res;
}
