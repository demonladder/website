import APIClient from '../APIClient';
import DiscordUserData from '../types/DiscordUserData';
import Level from '../../features/level/types/Level';
import LevelMeta from '../../features/level/types/LevelMeta';
import Role from '../types/Role';
import User from '../types/User';

export interface UserResponse extends User {
    Hardest?: Pick<Level, 'Rating'> & {
        Meta: Pick<LevelMeta, 'Name' | 'Difficulty'>;
    };
    DiscordData: DiscordUserData | null;
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
