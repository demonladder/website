import APIClient from '../APIClient';
import Level from '../../features/level/types/Level';
import LevelMeta from '../../features/level/types/LevelMeta';
import Role from '../types/Role';
import User from '../types/User';
import type DiscordUserData from '../types/DiscordUserData';

export interface UserResponse extends User {
    Hardest?: Pick<Level, 'Rating'> & {
        Meta: Pick<LevelMeta, 'Name' | 'Difficulty'>;
    };
    DiscordData: {
        GDDLID: Pick<DiscordUserData, 'GDDLID'>;
        ID?: DiscordUserData['ID'];
        Username?: DiscordUserData['Username'];
    } | null;
    CompletedPacks: { PackID: number; IconName: string }[];
    PendingSubmissionCount: number;
    SubmissionCount: number;
    TotalAttempts: number | null;
    Roles: Role[];
}

export default async function GetUser(userID: number): Promise<UserResponse> {
    const res = await APIClient.get<UserResponse>(`/user/${userID}`);
    return res.data;
}
